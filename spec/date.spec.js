'use strict'

const date = require('../lib/date.js'),
      helpers = require('./helpers.js')

describe('range', function() {
    it('with only one date', function() {
        expect(date.range(helpers.yesterday))
            .toEqual([helpers.yesterday, helpers.today])
    })

    it('same date', function() {
        expect(date.range(helpers.today)).toEqual([helpers.today])
    })

    it('with multiple dates', function() {
        expect(date.range(helpers.date().setHours(-72), helpers.yesterday))
            .toEqual([
                helpers.date().setHours(-72),
                helpers.date().setHours(-48),
                helpers.yesterday
            ])
    })
})

describe('convert', function() {
    it('3/4', function() {
        const year = new Date().getFullYear()
        expect(date.convert('3/4')).toEqual(helpers.date(`3/4/${year}`).getTime())
    })

    it('2/23/2014', function() {
        expect(date.convert('3/4/2014')).toEqual(helpers.date('3/4/2014').getTime())
    })

    describe('days as strings', function() {
        it('today', function() {
            expect(date.convert('today')).toEqual(helpers.date().getTime())
        })

        it('yesterday', function() {
            expect(date.convert('yesterday')).toEqual(helpers.date().setHours(-24))
        })

        it('sunday', function() {
            expect(date.convert('sunday')).toEqual(helpers.setDay(0))
        })

        it('monday', function() {
            expect(date.convert('monday')).toEqual(helpers.setDay(1))
        })

        it('tuesday', function() {
            expect(date.convert('tuesday')).toEqual(helpers.setDay(2))
        })

        it('wednesday', function() {
            expect(date.convert('wednesday')).toEqual(helpers.setDay(3))
        })

        it('thursday', function() {
            expect(date.convert('thursday')).toEqual(helpers.setDay(4))
        })

        it('friday', function() {
            expect(date.convert('friday')).toEqual(helpers.setDay(5))
        })

        it('saturday', function() {
            expect(date.convert('saturday')).toEqual(helpers.setDay(6))
        })
    })
})

// Worthless
it('today', function() {
    expect(date.today).toEqual(helpers.date())
})
