'use strict'

const parse = require('../lib/parse.js'),
      utils = require('./utils.js')

const today = utils.date().getTime()

describe('Check parsing date:', function() {
    it('today', function() {
        const out = [today, ['Run', 'away']]
        expect(parse.parseDate(['@today', 'Run', 'away'])).toEqual(out)
    })

    it('yesterday', function() {
        const d = utils.date()
        d.setDate(d.getDate() - 1)
        const yesterday = d.getTime(),
              out = [yesterday, []]
        expect(parse.parseDate(['@yesterday'])).toEqual(out)
    })

    it('8/10', function() {
        const d = utils.date('8/10')
        d.setYear(2016)

        const out = [d.getTime(), ['Watch', 'tv']]
        expect(parse.parseDate(['@8/10', 'Watch', 'tv'])).toEqual(out)
    })

    it('empty', function() {
        const out = [today, ['Developed', 'world']]
        expect(parse.parseDate(['Developed', 'world'])).toEqual(out)
    })

    it('invalid', function() {
        expect(function() {
            parse.parseDate(['@99/99', '90', 'minutes'])
        }).toThrow('Invalid date')
    })
})

describe('Check parsing range:', function() {
    it('no space b/w times', function() {
        const out = [utils.date().setHours(10), utils.date().setHours(13), 'run away']
        expect(parse.parseRange(today, '10-13 run away')).toEqual(out)
    })

    it('space b/w times', function() {
        const out = [utils.date().setHours(11, 39), utils.date().setHours(14, 23), '']
        expect(parse.parseRange(today, '11.39 - 14.23')).toEqual(out)
    })

    it('parse dates with single digits', function() {
        const out = [utils.date().setHours(8), utils.date().setHours(12), '']
        expect(parse.parseRange(today, '8.00-12.00')).toEqual(out)
    })

    it('invalid', function() {
        expect(function() {
            parse.parseRange(today, '')
        }).toThrow('Invalid range')
    })
})

describe('Check parsing tags:', function() {
    it('proper', function() {
        const out = [['+programming', '+tv'], ['run', 'with', 'wolves']]
        expect(parse.parseTags(['+programming', '+tv', 'run', 'with', 'wolves'])).toEqual(out)
    })

    it('missing', function() {
        expect(parse.parseTags(['watch', 'tv'])).toEqual([[], ['watch', 'tv']])
    })
})

describe('Check parsing time:', function() {
    it('proper', function() {
        const time = utils.date().setHours(10, 13, 0, 0)
        expect(parse.parseTime(['10.13', 'program'])).toEqual([time, ['program']])
    })

    it('missing', function() {
        expect(parse.parseTime(['watch', 'tv'])).toEqual([Date.now(), ['watch', 'tv']])
    })
})
