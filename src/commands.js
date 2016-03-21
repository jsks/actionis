'use strict'

const parse = require('./parse.js'),
      fmt = require('./fmt.js')

// TODO: tags, edit
module.exports = { add, dates, help, print, queue, rm, summarise }

function add(log, argArr) {
    const [tags, arr] = parse.parseTags(argArr),
          [date, tail] = parse.parseDate(arr),
          [start, stop, entry] = parse.parseRange(date, tail.join(' '))

    log.add(date, { start,
                    stop,
                    duration: stop - start,
                    activity: entry,
                    tags })

    return log.data
}

function help() {
    console.log(require('fs').readFileSync(`${__dirname}/../help.txt`, 'utf-8'))
}

function dates(log) {
    console.log(Object.keys(log.data)
                .filter(n => n != 'queue')
                .sort()
                .map(n => fmt.date(Number(n), { day: 'numeric',
                                                year: 'numeric',
                                                month: 'short'}))
                .join('\n'))
}

function queue(log, argArr) {
    const subcmd = (argArr.length > 0) ? argArr[0].toLowerCase() : undefined

    if (!subcmd) {
        if (log.data.queue)
            log.data.queue.forEach((n, i) => console.log(fmt.entry(n, i)))
    } else if (subcmd == 'pop') {
        const stop = Date.now(),
              { start, activity, tags } = log.pop()

        log.add(new Date().setHours(0, 0, 0, 0), { start,
                                                   stop: stop,
                                                   duration: stop - start,
                                                   activity,
                                                   tags })
    } else if (subcmd == 'clear') {
        log.data.queue.forEach((_, i) => log.rm('queue', i))
    } else {
        const [tags, arr] = parse.parseTags(argArr),
              [time, entry] = parse.parseTime(arr)

        log.add('queue', { start: time,
                           activity: entry.join(' '),
                           tags })
    }

    return log.data
}

function rm(log, argArr) {
    const [date, index] = parse.parseDate(argArr)
    if (isNaN(index))
        throw 'Invalid index'

    log.rm(date, index)
    return log.data
}

// TODO: date range
function print(log, argArr) {
    const [time, _] = parse.parseDate(argArr)

    if (log.data[time] && log.data[time].length > 0) {
        const opts = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }
        console.log(fmt.date(Number(time), opts))
        log.data[time].forEach((n, i) => console.log(`    ${fmt.entry(n, i)}`))
    }
}

// TODO: Add tags summary & date range
function summarise(log) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const entries = new Array(7).fill(0)
                                .map((_, i) => `${today.setHours(-24 * i)}`)
                                .filter(n => Object.keys(log.data).indexOf(n) > -1)
                                .map(n => log.data[n])
                                .reduce((m, n) => m.concat(n))

    entries.sort((a, b) => a.duration < b.duration)
           .slice(0, 5)
           .forEach((n, i) =>
               console.log(`${fmt.date(n.start, { weekday: 'long' })}\t${fmt.entry(n, i)}`))
}
