'use strict'

module.exports = {
    padNum: n => (n < 10 ? '0' : '') + n,
    padStr: {
        left: (str, c, n) => repeat(c, n) + str,
        right: (str, c, n) => str + repeat(c, n)
    },
    msToHrs: n => (n / (1000 * 60 * 60)).toFixed(2)
}

function repeat(c, n) {
    return (n > 1) ? c + repeat(c, n - 1) : c
}
