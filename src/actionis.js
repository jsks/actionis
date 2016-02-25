'use strict'

const fs = require('fs'),
    commands = require('./commands.js'),
    parse = require('./parse.js'),
    activity = require('./activity.js')

module.exports.exec = function(args) {
    const {cmd, time, tail} = parse(args)

    fs.readFile("test.json", function(err, data) {
        const log = activity(JSON.parse(data))

        commands[cmd](log, time, tail)
        fs.writeFileSync("test.json", log.data)
    })
}
