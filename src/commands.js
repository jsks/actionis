'use strict'

const parse = require('./parse.js')

// summarise, ids, tags, edit
module.exports = { add, dates, help, print, queue, rm }

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
                .map(n => {
                    const d = new Date(Number(n)),
                        fmt = { day: "numeric", year: "numeric", month: "short" }
                    return d.toLocaleString("latn", fmt)
                })
                .join('\n'))
}

function queue(log, argArr) {
    const subcmd = (argArr.length > 0) ? argArr[0].toLowerCase() : undefined

    if (!subcmd) {
        if (log.data.queue)
            log.data.queue.forEach((n, i) => {
                const start = new Date(n.start),
                      since = msToHrs(Date.now() - start.getTime()),
                      t = fmtTime(start)
                console.log(`(${i+1}) From ${t} => ${since}hrs elapsed: ${n.activity} [${n.tags}]`)
            })
    } else if (subcmd == 'pop') {
        const stop = Date.now(),
              { start, activity, tags } = log.pop()

        log.add(new Date().setHours(0, 0, 0, 0), { start,
                                                   stop: stop,
                                                   duration: stop - start,
                                                   activity,
                                                   tags })
    } else if (subcmd == "clear") {
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
        throw 'Not a number'

    log.rm(date, index)
    return log.data
}

function print(log, argArr) {
    const [time, _] = parse.parseDate(argArr)

    if (log.data[time] && log.data[time].length > 0) {
        const date = new Date(Number(time)),
                opts = { weekday: "long", day: "numeric", month: "short", year: "numeric" }
        console.log(date.toLocaleDateString("sv-SE", opts))

        log.data[time].forEach((n, i) => {
            const d = msToHrs(n.duration),
                    start = fmtTime(new Date(n.start)),
                    stop = fmtTime(new Date(n.stop))

            console.log(`    (${i+1}) ${start}-${stop} => ${d} hrs   ${n.activity} [${(n.tags) ? n.tags.join(' ') : ''}]`)
        })
    }
}

function fmtTime(d) {
    return `${pad(d.getHours())}.${pad(d.getMinutes())}`
}

function msToHrs(n) {
    return (n / ( 1000 * 60 * 60)).toFixed(2)
}

function pad(n) {
    return (n < 10 ? '0' : '') + n
}
