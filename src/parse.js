'use strict'

module.exports = { parseRange, parseDate, parseTags, parseTime }

function findDate(strs) {
    for (let i = 0; i < strs.length; i++)
        if (strs[i].charAt(0) === '@') return i

    return -1
}

function convertDate(str) {
    switch (str) {
    case 'today':
        return today().getTime()
    case 'yesterday':
        const date = today()
        date.setDate(date.getDate() - 1)
        return date.getTime()
    default:
        const datestr = (/^\d{1,2}\/\d{1,2}$/.test(str)) ?
            `${new Date().getFullYear()}/${str}` :
        str
        return new Date(datestr).getTime()
    }
}

function parseDate(argArr) {
    const dateIndex = findDate(argArr),
        date = (dateIndex > -1) ? convertDate(argArr[dateIndex].slice(1)) : today().getTime(),
          tail = (dateIndex > -1) ? argArr.filter((n, i) => i != dateIndex) : argArr

    if (isNaN(date))
        throw 'Invalid date'

    return [date, tail]
}

function findRange(str) {
    const r = str.match(/\d{1,2}(.\d{2})?\s*-\s*\d{1,2}(.\d{2})?/)
    return (r) ? [r[0], r.index] : ['', -1]
}

function parseRange(date, argStr) {
    const [range, rangeIndex] = findRange(argStr)
    if (rangeIndex == -1)
        throw 'Invalid range'

    const [start, stop] = range.replace(/\s*/g, '').split('-').map(n => {
        const d = new Date(date),
            [hours, mins] = n.split('.')
        d.setHours(hours, mins || 0, 0, 0)

        return d.getTime()
    })

    const entry = argStr.slice(0, rangeIndex) + argStr.slice(range.length + 1)

    return [start, stop, entry]
}

function parseTags(argArr) {
    return [ argArr.filter(n => n.charAt(0) == '+').map(n => n.toLowerCase()),
             argArr.filter(n => n.charAt(0) != '+') ]
}

function parseTime(argArr) {
    const date = new Date(),
        r = argArr.findIndex(n => /\d{1,2}(.\d{1,2})?/.test(n))

    if (r > -1) {
        const [hours, mins] = argArr[r].split('.')
        date.setHours(hours, mins || 0, 0, 0)
    }

    const tail = argArr.filter((n, i) => i != r)
    return [date.getTime(), tail]
}

function today() {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
}
