'use strict'

const activity = require('../lib/activity.js'),
      helpers = require('./helpers.js')


describe('Testing activity with', function() {
    const log = activity(),
          time = helpers.today

    const add1 = {
        start: '10.40',
        stop: '11.40',
        duration: 60,
        activity: 'Running',
        tags: ['+running']
    }

    it('adding new entry', function() {
        log.add(time, helpers.clone(add1))
        expect(Object.keys(log.data).filter(n => n != 'queue')
                                    .map(Number)).toEqual([time])
        expect(log.data[time][0]).toEqual(jasmine.objectContaining(add1))
    })

    const add2 = {
        start: '12.00',
        stop: '13.00',
        duration: 60,
        activity: 'Watching tv',
        tags: ['+tv']
    }

    it('adding twice', function() {
        log.add(time, helpers.clone(add2))
        expect(Object.keys(log.data).filter(n => n != 'queue')
                                    .map(Number)).toEqual([time])
        expect(log.data[time]).toEqual([jasmine.objectContaining(add2),
                                        jasmine.objectContaining(add1)])
    })

    it('deleting nonexistent time', function() {
        expect(() => log.rm(helpers.date('3/4'), 1)).toThrow()
        expect(log.data[time]).toEqual([jasmine.objectContaining(add2),
                                        jasmine.objectContaining(add1)])
    })

    it('deleting entry', function() {
        log.rm(time, 1)
        expect(Object.keys(log.data).filter(n => n != 'queue')
                                    .map(Number)).toEqual([time])
        expect(log.data[time]).toEqual([jasmine.objectContaining(add1)])
    })

    describe('queue', function() {
        const queue1 = {
            start: time,
            activity: 'actionis',
            tags: ['+programming']
        }

        it('add', function() {
            log.add('queue', helpers.clone(queue1))
            expect(log.data.queue[0]).toEqual(jasmine.objectContaining(queue1))
        })

        it('pop', function() {
            const queue2 = log.pop()
            expect(queue2).toEqual(jasmine.objectContaining(queue1))
            expect(log.data.queue).toEqual([])
        })

        it('empty pop', function() {
            expect(log.pop()).not.toBeDefined()
        })
    })
})
