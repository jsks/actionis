const utils = require('../lib/utils.js'),
      helpers = require('./helpers.js'),
      os = require('os')

describe('Testing utils:', function() {
    describe('isFile', function() {
        it('with actual file', function() {
            expect(utils.isFile(`${__dirname}/helpers.js`)).toBe(true)
        })

        it('with nonexistent file', function() {
            expect(utils.isFile('./sdflkjasdf.sdflkjsdf')).toBe(false)
        })
    })

    it('untildify', function() {
        expect(utils.untildify('~/hello.txt')).toEqual(`${os.homedir()}/hello.txt`)
    })

    it('flatten', function() {
        expect(utils.flatten([1, [2, [3, 4]]])).toEqual([1, 2, 3, 4])
    })

    it('unique', function() {
        expect(utils.unique([1, 2, 2, 3, 3])).toEqual([1, 2, 3])
    })

    it('objMap', function() {
        expect(utils.objMap({a: 1, b: 2}, (k, v) => v + 1)).toEqual({a: 2, b: 3})
    })

    it('padNum', function() {
        expect(utils.padNum(1)).toEqual('01')
    })

    describe('padstr', function() {
        it('left', function(){
            expect(utils.padStr.left('hello', 'x', 2)).toEqual('xxhello')
        })

        it('right', function() {
            expect(utils.padStr.right('yes', ' ', 3)).toEqual('yes   ')
        })
    })

    describe('dateRange', function() {
        it('with only one date', function() {
            expect(utils.dateRange(helpers.yesterday))
                .toEqual([helpers.yesterday.toString(), `${helpers.today}`])
        })

        it('same date', function() {
            expect(utils.dateRange(helpers.today)).toEqual([`${helpers.today}`])
        })

        it('with with dates', function() {
            expect(utils.dateRange(helpers.date().setHours(-72), helpers.yesterday))
                .toEqual([
                    `${helpers.date().setHours(-72)}`,
                    `${helpers.date().setHours(-48)}`,
                    `${helpers.yesterday}`
                ])
        })
    })

    it('mstohrs', function() {
        expect(utils.msToHrs(3600000)).toEqual('1.00')
    })

    // Worthless
    it('today', function() {
        expect(utils.today()).toEqual(helpers.date())
    })
})
