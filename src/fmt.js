'use strict'

const chalk = require('chalk')

module.exports = { date, entry }

function entry({ start = Date.now(), stop = Date.now(), duration = stop - start, activity, tags } = {}, i) {
    const d = msToHrs(duration),
          fmtStart = fmtTime(new Date(start)),
          fmtStop = fmtTime(new Date(stop)),
          tagStr = (tags) ? tags.join(' ') : ''

    const s1 = `${chalk.white(`${fmtStart}-${fmtStop} =>`)}`,
          s2 = `${chalk.red(`${d} hrs`)} ::`,
          s3 = `${chalk.yellow.italic(activity)} [${chalk.cyan(tagStr)}]`,
          prefix = (i > -1) ? chalk.blue(`${i+1} `) : ''

    return `${prefix}${s1} ${s2} ${s3}`
}

function date(d, opts) {
    const date = new Date(d)
    return chalk.green.bold(date.toLocaleDateString('sv-SE', opts))
}

function fmtTime(d) {
    return `${pad(d.getHours())}.${pad(d.getMinutes())}`
}

function msToHrs(n) {
    return (n / (1000 * 60 * 60)).toFixed(2)
}

function pad(n) {
    return (n < 10 ? '0' : '') + n
}
