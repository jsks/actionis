'use strict'

module.exports = function(data) {
    if (!data)
        data = {}

    function add(time, entry) {
        if (!data[time])
            data[time] = []

        entry.timestamp = Date.now()
        data[time].push(entry)

        data[time] = data[time].sort((a, b) => {
            return (a.start > b.start) ? -1 : 1
        })
    }

    function pop() {
        if (data.queue)
            return data.queue.pop()
    }

    function rm(time, index) {
        if (data[time])
            data[time].splice(index - 1, 1)

        if (data[time].length == 0)
            delete data[time]
    }

    function tags(time) {
        const t = Object.keys(data).map(k => data[k].map(n => n.tags))
        return flatten(t).filter((n, i, a) => a.indexOf(n) == i)
    }

    return {
        add,
        data,
        pop,
        rm,
        tags
    }
}

function flatten(x) {
    return (Array.isArray(x)) ? x.reduce((m, n) => m.concat(flatten(n)), []) : x
}
