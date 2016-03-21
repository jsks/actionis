'use strict'

const fs = require('fs'),
      os = require('os'),
      commands = require('./commands.js'),
      activity = require('./activity.js')

const jsonFile = `${os.homedir()}/.local/actionis/log.json`

module.exports.exec = function(args) {
    const cmd = args[0]

    if (!cmd) {
        console.log(Object.keys(commands).sort().join(' '))
        process.exit(0)
    } else if (Object.keys(commands).indexOf(cmd) == -1) {
        console.error('Invalid command')
        process.exit(1)
    }

    fs.readFile(jsonFile, function(err, data) {
        const log = activity(JSON.parse(data)),
              out = commands[cmd](log, args.slice(1))

        if (out)
            fs.writeFileSync(jsonFile, JSON.stringify(out))
    })
}
