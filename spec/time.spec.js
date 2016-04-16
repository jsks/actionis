'use strict'

const time = require('../lib/time.js'),
      helpers = require('./helpers.js')

describe('time', function() {
    describe('convert', function() {
        it('normal', function() {
            expect(time.convert('10.40.12.23')).toEqual(helpers.toMs({
                hrs: 10,
                mins: 40,
                secs: 12,
            }) + 23)
        })

        it('missing input', function() {
            expect(() => time.convert()).toThrow()
        })

        it('with only an hour given', function() {
            expect(time.convert('11')).toEqual(helpers.toMs({ hrs: 11 }))
        })
    })

    describe('timef', function() {
        it('simple output', function() {
            const o = time.timef(helpers.toMs({ hrs: 23, mins: 20, secs: 1 }), '%H.%M time')
            expect(o).toEqual('23.20 time')
        })

        it('with precision', function() {
            const o = time.timef(helpers.toMs({ hrs: 2, mins: 30 }), '%.2H hrs')
            expect(o).toEqual('2.50 hrs')
        })

        it('with no formatstring', function() {
            const ms = helpers.toMs({ hrs: 20 })
            expect(time.timef(ms)).toEqual(ms.toString())
        })

        it('invalid type', function() {
            expect(() => time.timef('sd')).toThrow()
        })
    })

    it('now', function() {
        jasmine.clock().install()
        const d = new Date()

        expect(time.now()).toEqual(helpers.toMs({
            hrs: d.getHours(),
            mins: d.getMinutes(),
            secs: d.getSeconds()
        }) + d.getMilliseconds())

        jasmine.clock().uninstall()
    })
})
