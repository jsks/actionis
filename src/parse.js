'use strict'

const date = require('./date.js'),
      time = require('./time.js'),
      { append } = require('./utils.js')

module.exports = function(str) {
    if (!str || str.length == 0)
        return {}

    function parse(gen, tree) {
        const token = gen.next()

        if (token.done)
            return tree

        if (/^\/\d{1,2}(.\d{2})?(\s*-\s*\d{1,2}(.\d{2})?)?\/$/.test(token.value))
            tree.time = parseTimes(token.value.slice(1, token.value.length - 1))
        else if (token.value.charAt(0) == '@')
            tree.dates = append(tree.dates, parseDates(token.value.slice(1)))
        else if (token.value.charAt(0) == '+')
            tree.tags = append(tree.tags, token.value.toLowerCase())
        else
            tree.tail = append(tree.tail, token.value)

        return parse(gen, tree)
    }

    const gen = tokenizer(str),
          token = gen.next(),
          argTree = parse(gen, { cmd: token.value })

    return argTree
}

function* tokenizer(str) {
    const i = str.search(/[^-]\s+(?!-)/)

    if (i > -1 && str.length > 1) {
        yield str.slice(0, i + 1)
        yield* tokenizer(str.slice(i + 2))
    } else
        yield str
}

function parseDates(dateStr) {
    if (dateStr.charAt(0) == '[' && dateStr.charAt(dateStr.length - 1) == ']') {
        const s = dateStr.match(/\[(.*)\]/)[1]

        if (!s || !/.*-.*/.test(s))
            throw 'Invalid date range'

        const [start, stop] = s.split('-').map(n => date.convert(n.trim()))

        return date.range(start, stop)
    } else
        return [date.convert(dateStr)]
}

function parseTimes(timeStr) {
    const times = timeStr.split('-').map(time.convert)

    return (!times[1]) ? times[0] : { start: times[0], stop: times[1] }
}
