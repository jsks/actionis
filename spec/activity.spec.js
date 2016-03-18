'use strict'

const activity = require('../lib/activity.js'),
      utils = require('./utils.js')


describe('Testing activity with', function() {
    const log = activity(),
          time = utils.date().getTime()

    const add1 = {
        start: '10.40',
        stop: '11.40',
        duration: 60,
        activity: 'Running',
        tags: ['+running']
    }

    it('adding new entry', function() {
        log.add(time, utils.clone(add1))
        expect(Object.keys(log.data).map(Number)).toEqual([time])

        const add2 = utils.clone(log.data[time][0])
        delete add2.timestamp
        expect(add2).toEqual(add1)
    })

    const add2 = {
        start: '12.00',
        stop: '13.00',
        duration: 60,
        activity: 'Watching tv',
        tags: ['+tv']
    }

    it('adding twice', function() {
        log.add(time, utils.clone(add2))
        expect(Object.keys(log.data).map(Number)).toEqual([time])

        const added = log.data[time].map(n => {
            const o = utils.clone(n)
            delete o.timestamp
            return o
        })
        expect(added).toEqual([add2, add1])
    })

    it('deleting entry', function() {
        log.rm(time, 1)
        expect(Object.keys(log.data).map(Number)).toEqual([time])

        const add2 = utils.clone(log.data[time][0])
        delete add2.timestamp
        expect(add2).toEqual(add1)
    })

    describe('queue', function() {
        const queue1 = {
            start: time,
            activity: 'actionis',
            tags: ['+programming']
        }

        it('add', function() {
            log.add('queue', utils.clone(queue1))
            const queue2 = log.data.queue[0]
            delete queue2.timestamp

            expect(log.data.queue[0]).toEqual(queue1)
        })

        it('pop', function() {
            const queue2 = log.pop()
            delete queue2.timestamp

            expect(queue2).toEqual(queue1)
            expect(log.data.queue).toEqual([])
        })
    })
})
