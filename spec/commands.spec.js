const commands = require('../lib/commands.js'),
      activity = require('../lib/activity.js'),
      utils = require('./utils.js')

const log = activity()

describe('Checking commands', function() {
    it('add', function() {
        const args = ['@today', '10-13.30', 'watch', 'tv', '+tv'],
              obj = utils.clone(commands.add(log, args)[utils.date().getTime()][0])
        delete obj.timestamp

        const start = utils.date().setHours(10),
                stop = utils.date().setHours(13, 30)

        const out = {
            start: start,
            stop: stop,
            duration: stop - start,
            activity: 'watch tv',
            tags: ['+tv']
        }

        expect(obj).toEqual(out)
    })

    describe('rm', function() {
        it('with index', function() {
            commands.rm(log, ['@today', '1'])
            expect(log.data).toEqual({})
        })

        it('invalid index', function() {
            expect(() => commands.rm(log, ['@today', 's'])).toThrow()
        })
    })

    describe('queue', function() {
        it('add', function() {
            commands.queue(log, ['7', 'running away', '+run'])
            const obj = utils.clone(log.data.queue[0])
            delete obj.timestamp

            expect(obj).toEqual({
                start: utils.date().setHours(7),
                activity: 'running away',
                tags: ['+run']
            })
        })

        it('pop', function() {
            commands.queue(log, ['pop'])
            const obj = utils.clone(log.data[utils.date().getTime()][0])
            delete obj.timestamp
            delete obj.stop
            delete obj.duration

            expect(obj).toEqual({
                start: utils.date().setHours(7),
                activity: 'running away',
                tags: ['+run']
            })
        })

        it('clear', function() {
            commands.queue(log, ['6', 'watching tv', '+tv'])
            commands.queue(log, ['clear'])

            expect(log.data.queue).toEqual(undefined)
        })
    })
})
