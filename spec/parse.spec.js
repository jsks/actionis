'use strict'

const parse = require('../lib/parse.js'),
    cmds = ['add', 'rm', 'print']

const d = new Date(),
    year = d.getFullYear()
d.setHours(0, 0, 0, 0)
const today = d.getTime()

d.setDate(d.getDate() - 1)
const yesterday = d.getTime()


cmds.forEach(function(cmd) {
    describe(`Parsing command (${cmd}) with`, function() {
        it ('time', function() {
            expect(parse(`${cmd} @yesterday`.split(' '))).toEqual(
                { cmd: `${cmd}`, time: yesterday, tail: '' })
        })

        it('time & tail', function() {
            expect(parse(`${cmd} @yesterday 2hrs Run wolves`.split(' '))).toEqual(
                { cmd: `${cmd}`, time: yesterday, tail: '2hrs Run wolves'})
        })

        it('tail', function() {
            expect(parse(`${cmd} watch tv`.split(' '))).toEqual(
                { cmd: `${cmd}`, time: today, tail: 'watch tv' })
        })

    })
})

describe('Parsing w/ wrong command when', function() {
    it('time', function() {
        expect(parse('what @yesterday'.split(' '))).toEqual(
            { cmd: 'add', time: yesterday, tail: 'what' })
    })

    it('time & tail', function() {
        expect(parse('what @yesterday what'.split(' '))).toEqual(
            { cmd: 'add', time: yesterday, tail: 'what what' })
    })

    it('tail', function() {
        expect(parse('what no time'.split(' '))).toEqual(
            { cmd: 'add', time: today, tail: 'what no time' })
    })
})

describe('Parsing w/o command when', function() {
    it('time', function() {
        expect(parse('@yesterday'.split(' '))).toEqual(
            { cmd: 'add', time: yesterday, tail: '' })
    })

    it('time & tail', function() {
        expect(parse('@yesterday running'.split(' '))).toEqual(
            { cmd: 'add', time: yesterday, tail: 'running' })
    })

    it('tail', function() {
        expect(parse('running'.split(' '))).toEqual(
            { cmd: 'add', time: today, tail: 'running' })
    })

    it('nothing', function() {
        expect(parse([])).toEqual(
            { cmd: 'add', time: today, tail: '' })
    })
})

describe('Parsing time when', function() {
    it('numeric month/day', function() {
        expect(parse('@8/4 10.42 - 19.23 immense'.split(' '))).toEqual(
            { cmd: 'add', time: new Date(`${year}/8/4`).getTime(), tail: '10.42 - 19.23 immense' })
    })

    it('numeric year/month/day', function() {
        expect(parse('@2014/5/2 nope'.split(' '))).toEqual(
            { cmd: 'add', time: new Date('2014/5/2').getTime(), tail: 'nope' })
    })

    it('no @', function() {
        expect(parse('rm yesterday'.split(' '))).toEqual(
            { cmd: 'rm', time: today, tail: 'yesterday' })
    })
})

