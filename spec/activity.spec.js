'use strict'

const activity = require('../lib/activity.js')

describe('Testing activity with', function() {
    const log = activity(),
        d = new Date()
    d.setHours(0, 0, 0, 0)
    const time = d.getTime()

    const add1 = { start: '10.40',
                   stop: '11.40',
                   duration: 60,
                   activity: 'Running' }
    it('adding new entry', function() {
        log.add(time, add1)
        const data = JSON.parse(log.data)
        expect(Object.keys(data).map(Number)).toEqual([time])

        expect(data[time]).toEqual([add1])
    })

    const add2 = { start: '12.00',
                   stop: '13.00',
                   duration: 60,
                   activity: 'Watching tv' }
    it('adding twice', function() {
        log.add(time, add2)
        const data = JSON.parse(log.data)
        expect(Object.keys(data).map(Number)).toEqual([time])

        expect(data[time]).toEqual([add2, add1])
    })

    it('deleting entry', function() {
        log.rm(time, 1)
        const data = JSON.parse(log.data)
        expect(Object.keys(data).map(Number)).toEqual([time])

        expect(data[time]).toEqual([add1])
    })
})
