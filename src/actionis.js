'use strict'

const fs = require('fs'),
      log = require('./log.js'),
      commands = require('./commands.js'),
      config = require('./config.js'),
      parse = require('./parse.js')

function error(msg) {
    console.error(msg)
    process.exit(1)
}

function isFile(file) {
    try {
        return fs.lstatSync(file).isFile()
    } catch (e) {
        return false
    }
}

module.exports = function(args) {
    const { configFile, tailArgs = [] } = config.parseCliArgs(args),
          { cmd, ...argTree } = parse(tailArgs.join(' '))

    try {
        const configData = config.load((isFile(configFile))
                                       ? JSON.parse(fs.readFileSync(configFile))
                                       : undefined)

        if (!isFile(configData.jsonFile))
            throw 'Log file not found!'

        const data = JSON.parse(fs.readFileSync(configData.jsonFile)),
              fns = commands(log(data), configData)

        if (!cmd) {
            console.log(Object.keys(fns).sort().join(' '))
            process.exit(0)
        } else if (!fns[cmd])
            error('Invalid command')

        const out = fns[cmd](argTree)

        if (out)
            fs.writeFileSync(configData.jsonFile, JSON.stringify(out.data) + '\n')
    } catch (e) {
        if (e instanceof Error)
            throw e

        error(e)
    }
}
