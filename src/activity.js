'use strict'

const { flatten, unique } = require('./utils.js')

module.exports = function(data = { queue: [] }) {
    function add(date, entry) {
        if (!data[date])
            data[date] = []

        entry.timestamp = Date.now()
        data[date].push(entry)

        data[date] = data[date].sort((a, b) => a.start < b.start)
    }

    function keys() {
        return Object.keys(data).filter(n => n != 'queue').map(Number)
    }

    function pop() {
        return data.queue.pop()
    }

    function rm(date, index) {
        if (data[date]) {
            data[date].splice(index - 1, 1)

            if (data[date].length == 0 && date != 'queue')
                delete data[date]
        } else
            throw 'Empty date'
    }

    function tags(dates = keys()) {
        const t = dates.filter(n => keys().indexOf(n) > -1)
                       .map(k => data[k].map(n => n.tags))

        return unique(flatten(t))
    }

    return { add, data, keys, pop, rm, tags }
}
