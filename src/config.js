'use strict'

const chalk = require('chalk'),
      { objMap, untildify } = require('./utils.js')

module.exports = { parseConfigArg, loadConfig }

function parseConfigArg(args) {
    const index = args.find(n => /^(--config|-c)$/.test(n))

    return {
        configFile: untildify((index > -1)
                              ? args[index + 1]
                              : '~/.config/actionis/config.json'),
        tailArgs: (index > -1) ? args.slice(0, index).concat(args.slice(index)) : args
    }
}

function loadConfig(data = { colors: {} }) {
    const defaultColors = {
        title: chalk.magenta.bold,
        date: chalk.green,
        tag: chalk.cyan,
        duration: chalk.red,
        timeRange: chalk.white,
        action: chalk.yellow.italic,
        index: chalk.blue,
        fill: chalk.white
    }

    const colors = Object.assign(objMap(data.colors, (k, v) => {
        const [c1, c2] = v.split('.')

        return (c2) ? chalk[c1][c2] : chalk[c1]
    }), defaultColors)

    return {
        colors,
        jsonFile: untildify(data.jsonFile || '~/.config/actionis/log.json')
    }
}
