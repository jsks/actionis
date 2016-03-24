'use strict'

const parse = require('./parse.js'),
      f = require('./fmt.js'),
      { padStr } = require('./utils'),
      chalk = require('chalk')

const c = {
    title: chalk.magenta.bold,
    date: chalk.green,
    tag: chalk.cyan,
    duration: chalk.red,
    timeRange: chalk.white,
    action: chalk.yellow.italic,
    index: chalk.blue,
    fill: chalk.white
}

const fmt = f(c)

// TODO: edit
module.exports = { add, dates, help, print, queue, rm, summarise, tags }

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
        log.data[time].forEach((n, i) => console.log(padStr.left(fmt.entry(n, i), ' ', 4)))
    }
}

function summarise(log) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    console.log(c.title('Top 5 entries:'))
    const entries = new Array(7).fill(0)
                                .map((_, i) => `${today.setHours(-24 * i)}`)
                                .filter(n => Object.keys(log.data).indexOf(n) > -1)
                                .map(n => log.data[n])
                                .reduce((m, n) => m.concat(n))

    entries.sort((a, b) => a.duration < b.duration)
           .slice(0, 5)
           .forEach((n, i) => {
               const opts = { weekday: 'short', day: 'numeric', month: 'short' }
               console.log(`${fmt.date(n.start, opts)} ${fmt.entry(n, i)}`)
           })

    console.log(c.title('\nBy Tag:'))
    const tags = log.tags().reduce((m, t) => {
        const e = entries.filter(n => n.tags.indexOf(t) > -1)
                         .reduce((m, n) => m + n.duration, 0)
        if (e) m[t] = e
        return m
    }, {})

    Object.keys(tags).sort((a, b) => tags[a] < tags[b])
        .forEach(n => console.log(`${c.tag(n)} ${fmt.elapsed(tags[n])}`))

    const f = [
        `\nTotal hrs: ${fmt.elapsed(entries.reduce((m, n) => m + n.duration, 0))}`,
        `Tags: ${c.tag(log.tags().length)}`,
        `Entries: ${c.action(entries.length)}`
    ].join(' ')
    console.log(`\n${c.fill(f)}`)
}

function tags(log) {
    console.log(c.tag(fmt.tag(log.tags())))
}
