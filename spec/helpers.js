'use strict'

module.exports = {
    clone: obj => JSON.parse(JSON.stringify(obj)),
    date: date,
    setDay: setDay,
    toMs: toMs,
    today: date().getTime(),
    yesterday: date().setHours(-24),
    colors: [
        'date',
        'index',
        'timeRange',
        'duration',
        'action',
        'tag',
        'fill',
        'title'
    ].reduce((m, n) => {
        m[n] = n => n
        return m
    }, {})
}

function date(str) {
    const d = (str) ? new Date(str) : new Date()
    d.setHours(0, 0, 0, 0)

    return d
}

function toMs(obj) {
    return Object.keys(obj).reduce((m, n) => {
        switch (n) {
            case 'hrs':
                return m + obj[n] * 60 * 60 * 1000
            case 'mins':
                return m + obj[n] * 60 * 1000
            case 'secs':
                return m + obj[n] * 1000
        }
    }, 0)
}

function setDay(day) {
    const d = date()

    for (let i = 0; i <= 6; i++) {
        if (d.getDay() == day)
            return d.getTime()

        d.setDate(d.getDate() - 1)
    }

    throw new Error(`Unable to find day: ${day}`)
}
