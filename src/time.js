'use strict'

const { padNum } = require('./utils.js')

module.exports = { convert, timef, now }

const table = {
    H: 60 * 60 * 1000,
    M: 60 * 1000,
    S: 1000,
    MS: 1
}

function between(n, a, b) {
    return a <= n && n <= b
}

function toMs(hrs, mins, secs, ms) {
    return hrs * table.H + mins * table.M + secs * table.S + ms
}

function now() {
    const d = new Date()

    return toMs(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds())
}

function convert(str) {
    if (typeof str != 'string')
        throw new TypeError('Invalid input')

    const [hrs, mins = 0, secs = 0, ms = 0] = str.split(/[.]|:/).map(Number)

    if (!between(hrs, 0, 24) || !between(mins, 0, 60) || !between(secs, 0, 60)
        || !between(ms, 0, 1000))
        throw 'Invalid time string'

    return toMs(hrs, mins, secs, ms)
}

function timef(ms, fmtStr) {
    if (typeof ms != 'number')
        throw new TypeError('Invalid input')

    if (fmtStr) {
        const regex = /%\d?([.]\d+)?\S/g,
              tokens = fmtStr.match(regex)
                             .sort((a, b) => table[a.slice(-1)] < table[b.slice(-1)]),
              tree = template(ms, tokens)

        return fmtStr.replace(regex, match => tree[match])
    } else
        return ms.toString()
}

function template(ms, fmtArr, tree = {}) {
    const unit = table[fmtArr[0].slice(-1)],
          precision = fmtArr[0].match(/^%\d?[.](\d+)\S$/),
          pad = /^%0/.test(fmtArr[0])

    const v = (precision)
          ? (ms / unit).toFixed(precision[1])
          : Math.floor(ms / unit)

    tree[fmtArr[0]] = (pad) ? padNum(v) : v
    const remainder = ms - (v * unit)

    return (fmtArr.length > 1) ? template(remainder, fmtArr.slice(1), tree) : tree
}
