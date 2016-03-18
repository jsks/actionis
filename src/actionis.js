'use strict'

const fs = require('fs'),
    os = require('os'),
    commands = require('./commands.js'),
    activity = require('./activity.js')

const jsonFile = `${os.homedir()}/.local/actionis/log.json`,
      argv = process.argv.slice(2),
      cmd = argv[0]

module.exports.exec = function(args) {
    if (!cmd) {
        console.log(Object.keys(commands).sort().join(' '))
        process.exit(0)
    }

    if (Object.keys(commands).indexOf(cmd) == -1) {
        console.error('Invalid command')
        process.exit(1)
    }

    fs.readFile(jsonFile, function(err, data) {
        const log = activity(JSON.parse(data)),
              out = commands[cmd](log, argv.slice(1), jsonFile)

        if (out)
            fs.writeFileSync(jsonFile, JSON.stringify(out))
    })
}
