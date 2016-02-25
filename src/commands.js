'use strict'

module.exports = { add, rm, print }

function add(data, time, tail) {
    const [range, rangeIndex] = findRange(tail)
    if (rangeIndex == -1)
        throw 'Error'

    const [start, stop] = parseRange(time, range),
        entry = tail.slice(0, rangeIndex) + tail.slice(range.length + 1)

    data.add(time, { start: `${start.getHours()}.${start.getMinutes()}`,
                     stop: `${stop.getHours()}.${stop.getMinutes()}`,
                     duration: stop - start, 
                     timestamp: Date.now(), 
                     activity: entry })
}

function rm(data, time, index) {
    if (isNaN(index))
        throw 'Not a number'

    data.rm(time, index)
}

function print(data, time) {
    data.print(time)
}

function findRange(str) {
    const r = str.match(/\d{2}(.\d{2})?\s*-\s*\d{2}(.\d{2})?/)
    return (r) ? [r[0], r.index] : ["", -1]
}

function parseRange(time, str) {
    return str.replace(/\s*/g, '').split('-').map(n => {
        const d = new Date(time),
            [hours, mins] = n.split('.')
        d.setHours(hours, mins, 0, 0)

        return d
    })
}
