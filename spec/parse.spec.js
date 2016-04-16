'use strict'

const parse = require('../lib/parse.js'),
      helpers = require('./helpers.js')

describe('Parse components:', function() {
    it('cmd', function() {
        expect(parse('add')).toEqual({ cmd: 'add' })
    })

    describe('date', function() {
        it('today', function() {
            const a = parse('rm @today')
            expect(a.dates).toEqual([helpers.today])
        })

        it('yesterday', function() {
            const b = parse('queue @yesterday')
            expect(b.dates).toEqual([helpers.yesterday])
        })

        it('3/4', function() {
            const c = parse('add @3/4')
            expect(c.dates).toEqual([helpers.date('3/4/2016').getTime()])
        })

        it('range 3/4 - 3/7', function() {
            const d = parse('print @[3/4 - 3/7]')
            expect(d.dates).toEqual([
                helpers.date('3/4/2016').getTime(),
                helpers.date('3/5/2016').getTime(),
                helpers.date('3/6/2016').getTime(),
                helpers.date('3/7/2016').getTime()
            ])
        })

        it('range yesterday - today', function() {
            const e = parse('print @[yesterday - today]')
            expect(e.dates).toEqual([
                helpers.yesterday,
                helpers.today
            ])
        })

        it('invalid date range', function() {
            expect(() => parse('print @[yesterday]')).toThrow()
        })

        it('empty date range', function() {
            expect(() => parse('print @[]')).toThrow()
        })

        it('invalid date', function() {
            expect(() => parse('print @no')).toThrow()
        })
    })

    describe('time', function() {
        it('10.00', function() {
            const o = parse('add /10.00/')
            expect(o.time).toEqual(helpers.toMs({ hrs: 10 }))
        })

        it('14.23', function() {
            const o = parse('add /14.23/')
            expect(o.time).toEqual(helpers.toMs({ hrs: 14, mins: 23 }))
        })

        it('7', function() {
            const o = parse('add /7/')
            expect(o.time).toEqual(helpers.toMs({ hrs: 7 }))
        })

        it('range 8.23 - 8.56', function() {
            const o = parse('add /8.23 - 8.56/')
            expect(o.time).toEqual({
                start: helpers.toMs({ hrs: 8, mins: 23 }),
                stop: helpers.toMs({ hrs: 8, mins: 56 })
            })
        })

        it('range 13.35-15.00', function() {
            const o = parse('add /13.35-15.00/')
            expect(o.time).toEqual({
                start: helpers.toMs({ hrs: 13, mins: 35 }),
                stop: helpers.toMs({ hrs: 15 })
            })
        })

        it('invalid time range', function() {
            expect(() => parse('add /13.56 - 45.45/')).toThrow()
        })

        it('invalid time', function() {
            expect(() => parse('add /13.99/')).toThrow()
        })
    })

    it('tags +run +tv', function() {
        const o = parse('add +run +tv')
        expect(o.tags).toEqual(['+run', '+tv'])
    })

    it('tail', function() {
        it('running with wolves', function() {
            const o = parse('add running with wolves')
            expect(o.tail).toEqual(['running', 'with', 'wolves'])
        })
    })
})

describe('parse full strings:', function() {
    it('full add w/ single date', function() {
        expect(parse('add @today watched tv +tv /10.00 - 11.30/')).toEqual({
            cmd: 'add',
            dates: [helpers.today],
            time: {
                start: helpers.toMs({ hrs: 10 }),
                stop: helpers.toMs({ hrs: 11, mins: 30 })
            },
            tags: ['+tv'],
            tail: ['watched', 'tv']
        })
    })

    it('full print w/ date range', function() {
        expect(parse('print +tv @[11/15-11/17]')).toEqual({
            cmd: 'print',
            dates: [
                helpers.date('11/15/2016').getTime(),
                helpers.date('11/16/2016').getTime(),
                helpers.date('11/17/2016').getTime()
            ],
            tags: ['+tv']
        })
    })

    it('parse index with rm', function() {
        expect(parse('rm @3/23 1 2')).toEqual({
            cmd: 'rm',
            dates: [helpers.date('3/23/2016').getTime()],
            tail: ['1', '2']
        })
    })

    it('empty string', function() {
        expect(parse()).toEqual({})
    })
})
