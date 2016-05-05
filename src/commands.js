'use strict'

const execFileSync = require('child_process').execFileSync,
      fmt = require('./fmt.js'),
      date = require('./date.js'),
      time = require('./time.js'),
      { padStr, unique } = require('./utils.js')

module.exports = function(log, config) {
    const formatter = fmt(config.colors)

    function add({
        dates = [date.today.getTime()],
        time,
        tail,
        tags = []
    }) {
        if (dates.indexOf('all') > -1)
            throw 'Invalid date'
        else if (!tail)
            throw 'No activity submitted'
        else if (!time || !time.stop || !time.start)
            throw 'Invalid time range'

        if (dates.length == 1 && time.stop < time.start)
            dates.push(dates[0] + time.convert('24'))

        dates.forEach((n, i, a) => {
            const start = (i == 0) ? time.start : 0,
                  stop = (i == a.length - 1) ? time.stop : time.convert('24')

            log.add(n, {
                start,
                stop,
                duration: stop - start,
                activity: tail.join(' '),
                tags
            })
        })

        print({ dates })

        return log
    }

    function help() {
        console.log('USAGE: actionis cmd [@date] [/time/] [activity|index] [+tags]')
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

    function edit({ dates = [date.today.getTime()], tail = [] }) {
        if (dates.length > 1)
            throw 'Can\'t edit range of dates'

        if (tail.length == 0 || !log.data[dates[0]])
            throw 'Invalid entry'

        tail.forEach(i => {
            const index = i - 1

            if (isNaN(index) || !log.data[dates[0]][index])
                throw 'Invalid index'

            const { start, stop, activity = '', tags = [], timestamp } = log.data[dates[0]][index],
                  json = JSON.stringify({
                      start: time.timef(start, '%H.%M.%S'),
                      stop: time.timef(stop, '%H.%M.%S'),
                      activity,
                      tags
                  }, null, 4)

            const edit = JSON.parse(execFileSync(config.editCmd, { input: json })),
                  nstart = time.convert(edit.start),
                  nstop = time.convert(edit.stop)

            log.data[dates[0]][index] = {
                start: nstart,
                stop: nstop,
                duration: nstop - nstart,
                activity: edit.activity || '',
                tags: edit.tags || [],
                timestamp
            }
        })

        print({ dates })

        return log
    }

    function queue({ time: mark, tail = [], tags }) {
        if (typeof mark == 'object')
            throw 'Cannot queue time range'

        const subcmd = (tail.length > 0) ? tail[0].toLowerCase() : ''

        function print() {
            const opts = {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            }

            log.data.queue.forEach((n, i) => {
                console.log(`Queue [${i+1}]`)

                const dates = date.range(n.dateStart, date.today.getTime()),
                      timeStop = time.now

                dates.forEach((d, i, a) => {
                    console.log(formatter.date(d, opts))
                    const start = (i == 0) ? n.start : 0,
                          stop = (i == a.length - 1) ? timeStop : time.convert('24')

                    console.log(formatter.entry({
                        start,
                        stop,
                        duration: stop - start,
                        activity: n.activity,
                        tags: n.tags
                    }))
                })

                if (dates.length > 1) {
                    const total = (24 - Number(time.timef(n.start, '%.2H')))
                          + Number(time.timef(timeStop, '%.2H'))
                          + ((dates.length > 2) ? 24 * (dates.length - 2) : 0)
                    console.log(`Total hrs: ${total.toFixed(2)}`)
                }
            })

        }

        function pop(added) {
            if (log.data.queue.length == 0)
                throw 'No entries in queue'

            const stop = added.stop || time.now,
                  dateStop = date.today.getTime(),
                  { dateStart, start, activity, tags } = log.pop()

            date.range(dateStart, dateStop).forEach((n, i, a) => {
                const timeStart = (i == 0) ? start : 0,
                      timeStop = (i == a.length - 1) ? stop : time.convert('24')

                log.add(n, {
                    start: timeStart,
                    stop: timeStop,
                    duration: timeStop - timeStart,
                    activity: added.activity || activity,
                    tags: added.tags || tags
                })
            })

            print()

            return log
        }

        function clear() {
            log.rm('queue', 1)
            if (log.data.queue.length > 0)
                clear()

            return log
        }

        function push({ start, activity, tags }) {
            log.add('queue', {
                dateStart: date.today.getTime(),
                start,
                activity,
                tags
            })

            return log
        }

        switch (subcmd) {
            case 'pop':
                return pop({
                    stop: mark,
                    activity: tail.slice(1).join(' '),
                    tags
                })
            case 'clear':
                return clear()
            case 'print':
                return print()
            default:
                return push({
                    start: mark || time.now,
                    activity: tail.join(' '),
                    tags
                })
        }
    }

    function rm({ dates = [date.today.getTime()], tail }) {
        if (dates.length > 1)
            throw 'rm only works on a single date'
        else if (tail.length == 0 || tail.some(n => isNaN(n)))
            throw 'Invalid index'

        unique(tail).sort((a, b) => a < b)
            .forEach(n => log.rm(dates[0], n))

        print({ dates })

        return log
    }

    // Allow sorting by time
    function print({ dates = [date.today.getTime()], tags = [] } = {}) {
        const keys = (dates.indexOf('all') > -1) ? log.keys() : dates

        keys.forEach(d => {
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
        const keys = (dates.indexOf('all') > -1) ? log.keys() : dates,
              range = (keys.length < 2)
                  ? date.range(keys[0] || date.today.setHours(-24 * 7), date.today.getTime())
                  : keys

        const entries = range.filter(n => log.keys().indexOf(n) > -1)
                             .map(n => log.data[n].map(e => ({ ...e, date: n })))
                             .reduce((m, n) => m.concat(n), [])

        if (entries.length == 0)
            throw 'No entries for specified range'

        console.log(config.colors.title('Top 5 entries:'))
        entries.sort((a, b) => b.duration - a.duration)
               .slice(0, 5)
               .forEach((n, i) => {
                   const opts = {
                       weekday: 'short',
                       day: 'numeric',
                       month: 'short'
                   }

                   console.log(`${formatter.date(n.date, opts)} ${formatter.entry(n, i)}`)
               })

        console.log(config.colors.title('\nBy Tag:'))
        const tags = log.tags().reduce((m, t) => {
            const e = entries.filter(n => n.tags.indexOf(t) > -1)
                             .reduce((m, n) => m + n.duration, 0)

            if (e > 0)
                m[t] = e

            return m
        }, {})

        Object.keys(tags).sort((a, b) => tags[a] < tags[b])
              .forEach(n => console.log(`${config.colors.tag(n)} ${formatter.elapsed(tags[n])}`))

        const f = [
            `Total hrs: ${formatter.elapsed(entries.reduce((m, n) =>
                                                           m + n.duration, 0))}`,
            `Tags: ${config.colors.tag(log.tags().length)}`,
            `Entries: ${config.colors.action(entries.length)}`
        ].join(' ')

        console.log(`\n${config.colors.fill(f)}`)
    }

    // Sorting by time?
    function tags({ dates }) {
        console.log(formatter.tag(log.tags((dates || []).indexOf('all') > -1
                                           ? log.keys()
                                           : dates)))
    }

    return { add, dates, edit, help, print, queue, rm, summarise, tags }
}
