'use strict'

const os = require('os')

module.exports = {
    between,
    padNum,
    padStr: { left, right },
    untildify,
    flatten,
    unique,
    append,
    objMap
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

function append(array, x) {
    if (array && !Array.isArray(array))
        throw new TypeError('Argument is not array')

    return (array || []).concat(x)
}

function objMap(obj, fn) {
    return Object.keys(obj).reduce((m, n) => {
        m[n] = fn(n, obj[n])

        return m
    }, {})
}

function between(n, a, b) {
    return a <= n && n <= b
}

function padNum(n) {
    return (n < 10 ? '0' : '') + n
}

// String padding
function left(str, c, n) {
    return repeat(c, n) + str
}

function right(str, c, n) {
    return str + repeat(c, n)
}

function repeat(c, n) {
    return (n > 1) ? c + repeat(c, n - 1) : c
}
