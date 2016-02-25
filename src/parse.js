'use strict'

const cmds = ['add', 'rm', 'print']

module.exports = function(args) {
    const cmd = (cmds.indexOf(args[0]) > -1) ? args[0] : '' 
    if (cmd) args = args.slice(1)

    const timeIndex = findTime(args),
        time = (timeIndex > -1) ? parseTime(args[timeIndex].slice(1)) : today().getTime(),
        tail = (timeIndex > -1) ? args.filter((n, i) => i != timeIndex) : args

    return {
        cmd: cmd || "add",
        time: time,
        tail: tail.join(' ')
    }
}

function findTime(strs) {
    for (let i = 0; i < strs.length; i++)
        if (strs[i].charAt(0) === '@') return i

    return -1
}

function parseTime(str) {
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

function today() {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
}
