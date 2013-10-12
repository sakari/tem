///<reference path="common.d.ts" />

var jsdom = require('jsdom').jsdom
var doc = jsdom('<html><body></body></html>')
global.window = doc.parentWindow

var should = require('should')
import should = require('should')
import tem = require('../src/tem')

var $ = require('../../lib/jquery')

describe('tem', () => {
    describe('html element templating', () => {

        it('produces empty fragment for empty template', () => {
            tem.plate.length.should.equal(0)
        })

        it('allows setting id of element', () => {
            tem.div().id('id').plate.attr('id')
                .should.eql('id')
        })

        it('allows setting child elements', () => {
            tem.div().child(tem.div()).plate.children().length
                .should.eql(1)
        })

        it('allows setting classes', () => {
            tem.div().class('c1').class('c2').plate.attr('class')
                .should.equal('c1 c2')
        })

        it('provides these html elements', () => {
            tem.div().plate.prop('tagName')
                .should.equal('DIV')
            tem.p().plate.prop('tagName')
                .should.equal('P')
            tem.span().plate.prop('tagName')
                .should.eql('SPAN')
            tem.input.text().plate.prop('tagName')
                .should.eql('INPUT')
        })

        describe('followedBy', () => {
            it('cannot use jquery `after` as it does not work', function() {
                var a = $('<div></div>')
                var b = $('<span></span>')
                a.after(b).length.should.equal(1) //this is a bug?
            })

            it('sidesteps the jquery bug', function() {
                var a = $('<div></div>')
                var b = $('<div></div>')
                var c = $('<div></div>')
                a.append(b, c)
                a.children().length.should.equal(2)
            })

            it('joins tags together', () => {
                tem.div()
                    .followedBy(tem.span())
                    .followedBy(tem.div())
                    .plate
                    .length
                    .should.equal(3)
            })
        })

        describe('input elements', () => {
            it('allows setting string value to text input', () => {
                tem.input.text()
                    .value("abc")
                    .plate
                    .val()
                    .should.equal('abc')
            })

            it('allows setting number value to number input', () => {
                tem.input.number()
                    .value(1)
                    .plate
                    .val()
                    .should.equal('1')
            })
        })

        describe('select', () => {
            it('allows only options as children', () => {
                tem.select()
                    .option(tem.option())
                    .plate
                    .find('option')
                    .length
                    .should.eql(1)
            })

            it('allows option variable as child', () => {
                var v = tem.variable.opt()
                v.set(tem.option())
                tem.select()
                    .option(v)
                    .plate
                    .find('option')
                    .length
                    .should.equal(1)
            })

            describe('option', () => {
                it('stringifies json object to value', () => {
                    var opt = tem.option().value({ foo: 1})
                    tem.select()
                        .option(opt)
                        .plate
                        .find('option').attr('value')
                        .should.equal('{"foo":1}')
                })

                it('leaves strings as is', () => {
                    tem.select().option(tem.option().value('abc'))
                        .plate.find('option').attr('value')
                        .should.equal('abc')
                })

                it('can be followed by other options', () => {
                    tem.option().followedBy(tem.option()).plate
                        .length
                        .should.eql(2)
                })

                it('can be followed by option vars', () => {
                    var o = tem.variable.opt()
                    o.set(tem.option())
                    tem.option().followedBy(o).plate.length
                        .should.eql(2)
                })
            })
        })
    })

    describe('variables', () => {
        it('variables are substituted', () => {
            var v = tem.variable.tag()
            var t = tem.div().child(v)
            v.set(tem.div())
            t.plate.find('div').length.should.eql(1)
        })
    })
})
