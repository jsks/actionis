'use strict'

const commands = require('../lib/commands.js'),
      activity = require('../lib/activity.js'),
      utils = require('../lib/utils.js'),
      helpers = require('./helpers.js')

describe('Checking activity commands:', function() {
    beforeEach(() => spyOn(console, 'log'))

    const log = activity(),
          cmds = commands(log, helpers.colors)

    describe('add', function() {
        it('normal', function() {
            const start = helpers.toMs({ hrs: 10 }),
                  stop = helpers.toMs({ hrs: 13, mins: 30 })

            const args = {
                time: {
                    start: start,
                    stop: stop
                },
                tail: ['watch', 'tv'],
                tags: ['+tv']
            }

            const obj = cmds.add(args).data[helpers.today][0]

            expect(obj).toEqual(jasmine.objectContaining({
                start: start,
                stop: stop,
                duration: stop - start,
                activity: 'watch tv',
                tags: ['+tv']
            }))
            expect(console.log).toHaveBeenCalled()
        })

        // Add multiple entries for 'rm' test
        for (let i = 0; i < 3; i++) {
            it('yesterday', function() {
                const start = helpers.toMs({ hrs: 20, mins: 23 }),
                      stop = helpers.toMs({ hrs: 23, mins: 1 })

                const args = {
                    dates: [helpers.yesterday],
                    time: {
                        start: start,
                        stop: stop,
                    },
                    tail: ['ran', 'into', 'the', 'woods'],
                    tags: ['+dead', '+ohno', '+running']
                }

                const obj = cmds.add(args).data[helpers.yesterday][i]

                expect(obj).toEqual(jasmine.objectContaining({
                    start: start,
                    stop: stop,
                    duration: stop - start,
                    activity: 'ran into the woods',
                    tags: ['+dead', '+ohno', '+running']
                }))
                expect(console.log).toHaveBeenCalled()
            })
        }

        it('invalid date', function() {
            expect(() => {
                cmds.add({
                    dates: [ helpers.today, Date.now() ]
                })
            }).toThrow()
        })

        it('blank activity', function() {
            expect(() => {
                cmds.add({
                    dates: [helpers.today]
                })
            }).toThrow()
        })

        it('invalid time', function() {
            expect(() => {
                cmds.add({
                    dates: [helpers.today],
                    time: { start: Date.now() },
                    tail: [ 'we' ]
                })
            }).toThrow()
        })
    })

    describe('rm', function() {
        it('with index', function() {
            cmds.rm({
                dates: [helpers.yesterday],
                tail: ['1']
            })
            expect(log.data[helpers.yesterday].length).toEqual(2)
            expect(console.log).toHaveBeenCalled()
        })

        it('w/o date', function() {
            cmds.rm({ tail: ['1'] })
            expect(log.data[helpers.today]).not.toBeDefined()
            expect(console.log).not.toHaveBeenCalled()
        })

        it('w/o index', function() {
            expect(() => cmds.rm({
                dates: [helpers.today]
            })).toThrow()
        })

        it('invalid date', function() {
            expect(() => cmds.rm({
                dates: [helpers.date('3/4').getTime()],
                tail: ['1']
            })).toThrow()
        })

        it('invalid date as range', function() {
            expect(() => cmds.rm({
                dates: [helpers.yesterday, helpers.today],
                tail: ['1']
            })).toThrow()
        })

        it('index range', function() {
            cmds.rm({
                dates: [helpers.yesterday],
                tail: ['1', '2']
            })
            expect(log.data[helpers.yesterday]).not.toBeDefined()
            expect(console.log).not.toHaveBeenCalled()
        })

        it('invalid index', function() {
            expect(() => cmds.rm({
                dates: [helpers.today],
                tail: ['s']
            })).toThrow()
        })
    })

    describe('queue', function() {
        beforeEach(() => jasmine.clock().install())
        afterEach(() => jasmine.clock().uninstall())

        it('add w/o info & upper case pop', function() {
            jasmine.clock().mockDate()

            cmds.queue({ tail: [], tags: [] })
            const d1 = new Date()
            const start = helpers.toMs({
                hrs: d1.getHours(),
                mins: d1.getMinutes(),
                secs: d1.getSeconds()
            }) + d1.getMilliseconds()

            expect(log.data.queue[0]).toEqual(jasmine.objectContaining({
                start: start,
                activity: '',
                tags: []
            }))

            jasmine.clock().tick(5000)
            jasmine.clock().mockDate()

            cmds.queue({ tail: ['POP', 'running', 'away'], tags: ['+run'] })
            const d2 = new Date()
            const stop = helpers.toMs({
                hrs: d2.getHours(),
                mins: d2.getMinutes(),
                secs: d2.getSeconds()
            }) + d2.getMilliseconds()

            expect(log.data[helpers.today][0]).toEqual(jasmine.objectContaining({
                start: start,
                stop: stop,
                duration: stop - start,
                activity: 'running away',
                tags: ['+run']
            }))
        })

        it('add w/ info & pop', function() {
            jasmine.clock().mockDate()

            cmds.queue({ tail: ['watch', 'tv'], tags: ['+tv', '+aliens'] })
            const d1 = new Date(),
                  start = helpers.toMs({
                      hrs: d1.getHours(),
                      mins: d1.getMinutes(),
                      secs: d1.getSeconds()
                  }) + d1.getMilliseconds()

            jasmine.clock().tick(5000)
            jasmine.clock().mockDate()

            cmds.queue({ tail: ['pop']})
            const d2 = new Date(),
                  stop = helpers.toMs({
                      hrs: d2.getHours(),
                      mins: d2.getMinutes(),
                      secs: d2.getSeconds(),
                  }) + d2.getMilliseconds()

            expect(log.data[helpers.today][0]).toEqual(jasmine.objectContaining({
                start: start,
                stop: stop,
                duration: stop - start,
                activity: 'watch tv',
                tags: ['+tv', '+aliens']
            }))
        })

        it('add & clear', function() {
            cmds.queue({
                time: helpers.date().setHours(12, 31),
                tail: ['running', 'away' ],
                tags: ['+run']
            })

            const obj = log.data.queue[0]

            expect(obj).toEqual(jasmine.objectContaining({
                start: helpers.date().setHours(12, 31),
                activity: 'running away',
                tags: ['+run']
            }))

            cmds.queue({ tail: ['clear'] })
            expect(log.data.queue).toEqual([])
        })

        it('empty', function() {
            expect(() => cmds.queue({ tail: ['pop']})).toThrow()
        })

        it('multiple queues and clear', function() {
            for (let i = 0; i < 4; i++)
                cmds.queue({ tail: [], tags: [] })
            cmds.queue({ tail: ['clear'] })
            expect(log.data.queue).toEqual([])
        })

        it('invalid time (as range)', function() {
            expect(() => cmds.queue({ time: { start: 1, stop: 4 }})).toThrow()
        })
    })
})

describe("Checking output commands:", function() {
    const log = activity({}),
          cmds = commands(log, helpers.colors)

    beforeEach(() => {
        spyOn(console, 'log')
    })

    const range = [
        [ helpers.yesterday, '+programming' ],
        [ helpers.today, '+tv' ],
        [ helpers.date().setHours(-48), '+puppy' ],
        [ 'queue', '+ridiculous']
    ]

    range.forEach(n => {
        const start = helpers.toMs({ hrs: 10 }),
              stop = helpers.toMs({ hrs: 13, mins: 24 })

        log.add(n[0], {
            start: start,
            stop: stop,
            duration: stop - start,
            activity: 'programming actionis with a puppy in my lap',
            tags: [n[1]]
        })
    })

    it('help', function() {
        cmds.help()
        expect(console.log).toHaveBeenCalledTimes(1)
    })

    it('dates', function() {
        cmds.dates()
        expect(console.log).toHaveBeenCalledTimes(1)
    })

    describe('queue', function() {
        it('output', function() {
            cmds.queue({ tail: ['print'] })
            expect(console.log).toHaveBeenCalledTimes(1)
        })

        it('blank', function() {
            cmds.queue({ tail: ['clear'] })
            cmds.queue({ tail: ['print'] })
            expect(console.log).not.toHaveBeenCalled()
        })
    })

    describe('print', function() {
        it('single date', function() {
            cmds.print({ dates: [helpers.today], tags: [] })
            expect(console.log).toHaveBeenCalledTimes(2)
        })

        it('date range', function() {
            cmds.print({
                dates: [ helpers.yesterday, helpers.today ],
                tags: []
            })
            expect(console.log).toHaveBeenCalledTimes(4)
        })

        it('nonexistent date', function() {
            cmds.print({ dates: [helpers.date('4/3/2008').getTime()], tags: [] })
            expect(console.log).not.toHaveBeenCalled()
        })

        it('with tags', function() {
            cmds.print({ tags: ['+tv'] })
            expect(console.log).toHaveBeenCalledTimes(2)
        })

        it('invalid tags', function() {
            cmds.print({ tags: ['+nope'] })
            expect(console.log).not.toHaveBeenCalled()
        })
    })

    describe('summarise', function() {
        it('with full tags', function() {
            cmds.summarise()
            expect(console.log).toHaveBeenCalledTimes(9)
        })

        it('excluded tags', function() {
            const start = helpers.toMs({ hrs: 12 }),
                  stop = helpers.toMs({ hrs: 14, mins: 23 })

            log.add(helpers.date('3/4/2014').getTime(), {
                start: start,
                stop: stop,
                duration: stop - start,
                activity: 'ride a whale',
                tags: ['+riding']
            })
            cmds.summarise()
            expect(console.log).toHaveBeenCalledTimes(9)
        })

        it('empty date ranges', function() {
            expect(() => cmds.summarise({
                dates: [
                    helpers.date('3/2/2012').getTime(),
                    helpers.date('4/1/2012').getTime()
                ]
            })).toThrow()
        })

        it('missing range stop', function() {
            cmds.summarise({ dates: [helpers.yesterday] })
            expect(console.log).toHaveBeenCalledTimes(7)
        })
    })

    describe('tags', function() {
        it('for yesterday', function() {
            cmds.tags({ dates: [helpers.yesterday] })
            expect(console.log).toHaveBeenCalledTimes(1)
            expect(console.log).toHaveBeenCalledWith('+programming')
        })

        it('for today', function() {
            cmds.tags({})
            expect(console.log).toHaveBeenCalledTimes(1)
            expect(console.log).toHaveBeenCalledWith('+programming +puppy +riding +tv')
        })

        it('for date range', function() {
            cmds.tags({
                dates: [
                    helpers.date().setHours(-72),
                    helpers.date().setHours(-48),
                    helpers.yesterday,
                    helpers.today
                ]
            })
            expect(console.log).toHaveBeenCalledTimes(1)
            expect(console.log).toHaveBeenCalledWith('+programming +puppy +tv')
        })
    })
})
