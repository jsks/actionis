'use strict'

const fmt = require('./fmt.js'),
      date = require('./date.js'),
      time = require('./time.js'),
      { padStr, unique } = require('./utils.js')

// TODO: edit
module.exports = function(log, colors) {
    const formatter = fmt(colors)

    // TODO: Wrap times
    function add(argTree) {
        if (argTree.dates && argTree.dates.length != 1)
            throw 'Invalid date'
        else if (!argTree.tail)
            throw 'No activity submitted'
        else if (!argTree.time || !argTree.time.stop || !argTree.time.start)
            throw 'Invalid time range'

        log.add((argTree.dates && argTree.dates[0]) || date.today().getTime(), {
            start: argTree.time.start,
            stop: argTree.time.stop,
            duration: argTree.time.stop - argTree.time.start,
            activity: argTree.tail.join(' '),
            tags: argTree.tags || []
        })

        print({ dates: argTree.dates || [date.today().getTime()] })

        return log
    }

    function help() {
        console.log(require('fs').readFileSync(`${__dirname}/../help.txt`, 'utf-8'))
    }

    function dates() {
        console.log(Object.keys(log.data)
                    .filter(n => n != 'queue')
                    .sort()
                    .map(n => formatter.date(Number(n), {
                        day: 'numeric',
                        year: 'numeric',
                        month: 'short'
                    }))
                    .join('\n'))
    }

    function queue({ time: start, tail = [], tags }) {
        if (typeof start == 'object')
            throw 'Cannot queue time range'

        const subcmd = (tail.length > 0) ? tail[0].toLowerCase() : ''

        function print() {
            log.data.queue.forEach((n, i) => console.log(formatter.entry(n, i)))
        }

        function pop(added) {
            if (log.data.queue.length == 0)
                throw 'No entries in queue'

            const stop = time.now(),
                  { start, activity, tags } = log.pop()

            log.add(new Date().setHours(0, 0, 0, 0), {
                start,
                stop,
                duration: stop - start,
                activity: added.activity || activity,
                tags: added.tags || tags
            })

            return log
        }

        function clear() {
            log.rm('queue', 1)
            if (log.data.queue.length > 0)
                clear()

            return log
        }

        function add({ start, activity, tags }) {
            log.add('queue', {
                start,
                activity,
                tags
            })

            return log
        }

        switch (subcmd) {
            case 'pop':
                return pop({
                    activity: tail.slice(1).join(' '),
                    tags
                })
            case 'clear':
                return clear()
            case 'print':
                return print()
            default:
                return add({
                    start: start || time.now(),
                    activity: tail.join(' '),
                    tags
                })
        }
    }

    function rm({ dates = [date.today().getTime()], tail }) {
        if (dates.length > 1)
            throw 'rm only works on a single date'
        else if (tail.length == 0 || tail.some(n => isNaN(n)))
            throw 'Invalid index'

        unique(tail).sort((a, b) => a < b)
            .forEach(n => log.rm(dates[0], n))

        print({ dates })

        return log
    }

    function print({ dates = [date.today().getTime()], tags = [] }) {
        dates.forEach(d => {
            if (log.data[d]) {
                const e = log.data[d].filter(n => {
                    return tags.length == 0 || tags.every(t => n.tags.indexOf(t) > -1)
                })

                if (e.length > 0) {
                    console.log(formatter.date(Number(d), {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }))

                    e.forEach((n, i) => {
                        console.log(padStr.left(formatter.entry(n, i), ' ', 4))
                    })
                }
            }
        })
    }

    function summarise({ dates = [] } = {}) {
        const range = (dates.length < 2)
              ? date.range(dates[0] || date.today().setHours(-24 * 7), date.today().getTime())
              : dates

        const entries = range.filter(n => log.keys().indexOf(n) > -1)
                             .map(n => log.data[n])
                             .reduce((m, n) => m.concat(n), [])

        if (entries.length == 0)
            throw 'No entries for the last week'

        console.log(colors.title('Top 5 entries:'))
        entries.sort((a, b) => a.duration < b.duration)
            .slice(0, 5)
            .forEach((n, i) => {
                const opts = {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                }

                console.log(`${formatter.date(n.start, opts)} ${formatter.entry(n, i)}`)
            })

        console.log(colors.title('\nBy Tag:'))
        const tags = log.tags().reduce((m, t) => {
            const e = entries.filter(n => n.tags.indexOf(t) > -1)
                             .reduce((m, n) => m + n.duration, 0)

            if (e > 0)
                m[t] = e

            return m
        }, {})

        Object.keys(tags).sort((a, b) => tags[a] < tags[b])
            .forEach(n => console.log(`${colors.tag(n)} ${formatter.elapsed(tags[n])}`))

        const f = [
            `\nTotal hrs: ${formatter.elapsed(entries.reduce((m, n) =>
                                                             m + n.duration, 0))}`,
            `Tags: ${colors.tag(log.tags().length)}`,
            `Entries: ${colors.action(entries.length)}`
        ].join(' ')

        console.log(`\n${colors.fill(f)}`)
    }

    function tags({ dates }) {
        console.log(formatter.tag(log.tags(dates)))
    }

    return { add, dates, help, print, queue, rm, summarise, tags }
}
