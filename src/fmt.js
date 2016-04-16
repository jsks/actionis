'use strict'

const time = require('./time.js')

module.exports = function(colors) {
    function entry({
        start = 0,
        stop = time.now(),
        duration = stop - start,
        activity,
        tags
    } = {}, i) {
        const e = [
            ((i > -1) ? colors.index(`${i + 1}`) : ''),
            timeRange(start, stop),
            elapsed(duration),
            '::',
            colors.action(activity),
            `[ ${tag(tags)} ]`
        ].join(' ')

        return colors.fill(e)
    }

    function date(d, opts) {
        return colors.date(new Date(d).toLocaleDateString('sv-SE', opts))
    }

    function elapsed(d) {
        return colors.duration(`${time.timef(d, '%.2H')} hrs`)
    }

    function timeRange(start, stop) {
        const fmt = d => `${time.timef(d, '%0H.%0M')}`

        return colors.timeRange(`${fmt(start)}-${fmt(stop)} =>`)
    }

    function tag(t = []) {
        return `${colors.tag(t.sort().join(' '))}`
    }

    return {
        entry,
        elapsed,
        date,
        timeRange,
        tag
    }
}
