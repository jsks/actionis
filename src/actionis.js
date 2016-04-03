'use strict'

const fs = require('fs'),
      parse = require('./parse.js'),
      commands = require('./commands.js'),
      activity = require('./activity.js'),
      { parseConfigArg, loadConfig } = require('./config.js'),
      { isFile } = require('./utils.js')

function error(msg) {
    console.error(msg)
    process.exit(1)
}

module.exports = function(args) {
    const { configFile, tailArgs = [] } = parseConfigArg(args),
          { cmd, ...argTree } = parse(tailArgs.join(' '))

    try {
        const configData = (isFile(configFile))
              ? JSON.parse(fs.readFileSync(configFile))
              : undefined

        const config = loadConfig(configData)

        if (!isFile(config.jsonFile))
            throw 'Log file not found!'

        const log = JSON.parse(fs.readFileSync(config.jsonFile)),
              fns = commands(activity(log), config.colors)

        if (!cmd) {
            console.log(Object.keys(fns).sort().join(' '))
            process.exit(0)
        } else if (!fns)
            error('Invalid command')

        const out = fns[cmd](argTree)

        if (out)
            fs.writeFileSync(config.jsonFile, JSON.stringify(out.data))
    } catch (e) {
        error(e)
    }
}
