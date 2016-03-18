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

    function print(time) {
        function fmtTime(d) {
            return `${d.getHours()}.${d.getMinutes()}`
        }

        if (data[time] && data[time].length > 0) {
            const date = new Date(Number(time)),
                  opts = { weekday: "long", day: "numeric", month: "short", year: "numeric" }
            console.log(date.toLocaleDateString("sv-SE", opts))

            data[time].forEach((n, i) => {
                const d = (n.duration / (1000 * 60 * 60)).toFixed(2),
                      start = fmtTime(new Date(n.start)),
                      stop = fmtTime(new Date(n.stop))

                console.log(`    (${i+1}) ${start}-${stop} => ${d} hrs   ${n.activity} [${(n.tags) ? n.tags.join(' ') : ''}]`)
            })
        }
    }

    return {
        add,
        rm,
        pop,
        data
    }
}
