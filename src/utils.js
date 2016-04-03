'use strict'

const os = require('os'),
      fs = require('fs')

module.exports = {
    padNum,
    padStr: { left, right },
    untildify,
    dateRange,
    msToHrs,
    today,
    flatten,
    unique,
    objMap,
    isFile
}

function isFile(file) {
    try {
        return fs.lstatSync(file).isFile()
    } catch (e) {
        return false
    }
}

function untildify(path) {
    return path.replace('~/', `${os.homedir()}/`)
}

function flatten(x) {
    return (Array.isArray(x)) ? x.reduce((m, n) => m.concat(flatten(n)), []) : x
}

function unique(x) {
    return x.filter((n, i, a) => a.indexOf(n) == i)
}

function objMap(obj, fn) {
    return Object.keys(obj).reduce((m, n) => {
        m[n] = fn(n, obj[n])

        return m
    }, {})
}

// Padding
function padNum(n) {
    return (n < 10 ? '0' : '') + n
}

function left(str, c, n) {
    return repeat(c, n) + str
}

function right(str, c, n) {
    return str + repeat(c, n)
}

function repeat(c, n) {
    return (n > 1) ? c + repeat(c, n - 1) : c
}

// Date functions
function dateRange(start, stop = today().getTime()) {
    if (start == stop)
        return [start.toString()]

    const diff = Math.round(msToHrs(stop - start) / 24)

    return new Array(diff + 1).fill(0)
        .map((_, i) => `${new Date(stop).setHours(24 * (i - diff))}`)
}

function msToHrs(n) {
    return (n / (1000 * 60 * 60)).toFixed(2)
}

function today() {
    const d = new Date()

    d.setHours(0, 0, 0, 0)

    return d
}
