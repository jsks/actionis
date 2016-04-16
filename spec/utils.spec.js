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

    describe('append', function() {
        it('to array', function() {
            expect(utils.append([], 2)).toEqual([2])
        })

        it('invalid input', function() {
            expect(() => utils.append(2, 2)).toThrow()
        })
    })

    describe('padNum', function() {
        it('1', function() {
            expect(utils.padNum(1)).toEqual('01')
        })

        it('11', function() {
            expect(utils.padNum(11)).toEqual('11')
        })
    })

    describe('padstr', function() {
        it('left', function(){
            expect(utils.padStr.left('hello', 'x', 2)).toEqual('xxhello')
        })

        it('right', function() {
            expect(utils.padStr.right('yes', ' ', 3)).toEqual('yes   ')
        })
    })

})
