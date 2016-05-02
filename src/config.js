'use strict'

const chalk = require('chalk'),
      { objMap, untildify } = require('./utils.js')

module.exports = { parseCliArgs, load }

function parseCliArgs(args) {
    const index = args.find(n => /^(--config|-c)$/.test(n))

    return {
        configFile: untildify((index > -1)
                              ? args[index + 1]
                              : '~/.config/actionis/config.json'),
        tailArgs: (index > -1) ? args.slice(0, index).concat(args.slice(index)) : args
    }
}

function load({ colors = {}, jsonFile, editCmd = 'vipe' } = {}) {
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

    const colorsMerged = Object.assign(objMap(colors, (k, v) => {
        const [c1, c2] = v.split('.')

        return (c2) ? chalk[c1][c2] : chalk[c1]
    }), defaultColors)

    return {
        colors: colorsMerged,
        jsonFile: untildify(jsonFile || '~/.config/actionis/log.json'),
        editCmd
    }
}
