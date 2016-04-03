'use strict'

const { msToHrs, padNum } = require('./utils.js')

module.exports = function(colors) {
    function entry({
        start = Date.now(),
        stop = Date.now(),
        duration = stop - start,
        activity, tags } = {}, i) {
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
        return colors.duration(`${msToHrs(d)} hrs`)
    }

    function time(d) {
        return `${padNum(d.getHours())}.${padNum(d.getMinutes())}`
    }

    function timeRange(start, stop) {
        return colors.timeRange(`${time(new Date(start))}-${time(new Date(stop))} =>`)
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
