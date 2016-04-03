'use strict'

const { today } = require('./utils.js')

module.exports = function(str) {
    if (!str || str.length == 0)
        return {}

    function parse(gen, tree) {
        const token = gen.next()

        if (token.done)
            return tree

        if (/^\d{1,2}(.\d{2})?(\s*-\s*\d{1,2}(.\d{2})?)?$/.test(token.value)
            && tree.cmd != 'rm')
            tree.time = parseTimes(token.value)
        else if (token.value.charAt(0) == '@')
            tree.date = parseDates(token.value.slice(1))
        else if (token.value.charAt(0) == '+')
            tree.tags.push(token.value.toLowerCase())
        else
            tree.tail.push(token.value)

        return parse(gen, tree)
    }

    const gen = tokenizer(str),
          token = gen.next(),
          cmd = token.value,
          argTree = parse(gen, { cmd, tail: [], tags: [] })

    return argTree
}

function* tokenizer(str) {
    const i = str.search(/[^-]\s(?!-)/)

    if (i > -1 && str.length > 1) {
        yield str.slice(0, i + 1)
        yield* tokenizer(str.slice(i + 2))
    } else
        yield str
}

function convertDate(str) {
    switch (str) {
        case 'today':
            return today().getTime()
        case 'yesterday':
            return today().setHours(-24)
        default: {
            const datestr = (/^\d{1,2}\/\d{1,2}$/.test(str))
                ? `${new Date().getFullYear()}/${str}`
                : str

            const d = new Date(datestr)

            if (isNaN(d))
                throw 'Invalid date'

            return d.getTime()
        }
    }
}

function parseDates(dateStr) {
    if (dateStr.charAt(0) == '[' && dateStr.charAt(dateStr.length - 1) == ']') {
        const s = dateStr.match(/\[(.*)\]/)[1]

        if (!s || !/.*-.*/.test(s))
            throw 'Invalid date range'

        const [start, stop] = s.split('-').map(n => convertDate(n.trim()))

        return { start, stop }
    } else
        return convertDate(dateStr)
}

function convertTime(timeStr) {
    const [hr, min = 0] = timeStr.split('.')

    return today().setHours(hr, min)
}

function parseTimes(timeStr) {
    function checkBounds(a) {
        const [hr, min = 0] = a.split('.').map(Number)

        return (hr <= 24 && hr >= 0) && (min <= 60 && min >= 0)
    }

    const times = timeStr.split('-')

    if (!times.every(checkBounds))
        throw 'Invalid time'

    const [start, stop] = times.map(convertTime)

    return (!stop) ? start : { start, stop }
}
