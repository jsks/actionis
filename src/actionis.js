'use strict'

const fs = require('fs'),
    os = require('os'),
    commands = require('./commands.js'),
    parse = require('./parse.js'),
    activity = require('./activity.js')

const jsonFile = `${os.homedir()}/.local/actionis/log.json`

module.exports.exec = function(args) {
    const {cmd, time, tail} = parse(args)

    fs.readFile(jsonFile, function(err, data) {
        const log = activity(JSON.parse(data))

        commands[cmd](log, time, tail)
        fs.writeFileSync(jsonFile, log.data)
    })
}
