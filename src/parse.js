'use strict'

const { today } = require('./utils.js')

module.exports = function(str) {
    if (!str || str.length == 0)
        return {}

    function parse(gen, tree) {
        const token = gen.next()
        if (token.done)
            return tree

        if (/^\d{1,2}(.\d{2})?(\s*-\s*\d{1,2}(.\d{2})?)?$/.test(token.value))
            tree.times = parseTimes(token.value)
        else if (token.value.charAt(0) == '@')
            tree.dates = parseDates(token.value.slice(1))
        else if (token.value.charAt(0) == '+')
            tree.tags.push(token.value.toLowerCase())
        else
            tree.activity.push(token.value)

        return parse(gen, tree)
    }

    const gen = tokenizer(str),
          token = gen.next(),
          cmd = token.value,
          argTree = { cmd, activity: [], tags: [] }

    return parse(gen, argTree)
}

function* tokenizer(str) {
    const i = str.search(/[^-]\s(?!-)/)
    if (i > -1) {
        yield str.slice(0, i + 1)
        yield* tokenizer(str.slice(i + 2))
    } else {
        yield str
    }
}

function convertDate(str) {
    switch (str) {
        case 'today':
            return today().getTime()
        case 'yesterday':
            return today().setHours(-24)
        default:
            const datestr = (/^\d{1,2}\/\d{1,2}$/.test(str)) ?
                `${new Date().getFullYear()}/${str}` :
                str
            return new Date(datestr).getTime()
    }
}

function parseDates(dateStr) {
    if (dateStr.charAt(0) == '[' && dateStr.charAt(dateStr.length-1) == ']') {
        const s = dateStr.match(/\[(.*)\]/)[1]
        if (!s || !/.*-.*/.test(s))
            throw 'Invalid date range'

        const [start, stop] = s.split('-').map(n => convertDate(n.trim()))
        return { start, stop }
    } else
        return { stop: convertDate(dateStr) }
}

function parseTimes(timeStr) {
    const [start, stop] = timeStr.split('-').map(n => n.trim())
    return (!stop) ? { stop: start} : { start, stop }
}
