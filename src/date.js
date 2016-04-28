'use strict'

module.exports = { convert, range, get today() { return date() } }

function date(str) {
    const d = (str) ? new Date(str) : new Date()

    d.setHours(0, 0, 0, 0)

    return d
}

function setDay(n) {
    const d = date(),
          diff = d.getDay() - n

    return d.setDate(d.getDate() - ((diff < 0) ? 7 + diff : diff))
}

const table = {
    all: 'all',
    today: date().getTime(),
    yesterday: date().setHours(-24),
    sunday: setDay(0),
    monday: setDay(1),
    tuesday: setDay(2),
    wednesday: setDay(3),
    thursday: setDay(4),
    friday: setDay(5),
    saturday: setDay(6)
}

function convert(str) {
    if (table[str])
        return table[str]

    const datestr = (/^\d{1,2}\/\d{1,2}$/.test(str))
            ? `${date().getFullYear()}/${str}`
            : str

    const d = date(datestr)

    if (isNaN(d))
        throw 'Invalid date'

    return d.getTime()
}

function range(start, stop = date().getTime()) {
    if (start == stop)
        return [start]

    const diff = Math.round((stop - start) / (24 * 60 * 60 * 1000))

    return new Array(diff + 1).fill(0)
        .map((_, i) => new Date(stop).setHours(24 * (i - diff)))
}
