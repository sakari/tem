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
            tem.div().append(tem.div()).plate.children().length
                .should.eql(1)
        })

        it('allows setting classes', () => {
            tem.div().class('c1').class('c2').plate.attr('class')
                .should.equal('c1 c2')
        })

        it('allows changing the element structure after plating', () => {
            var div = tem.div()
            var q = tem.div().append(div).plate

            div.append(tem.span().id('addedSpan'))
            q.find('#addedSpan').length.should.eql(1)
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

        describe('bind', () => {
            it('gets called with the element', () => {
                var got = false
                var e = tem.input.text().bind((t) => {
                    t.plate.change(()=> {
                        got = true
                    })
                }).plate
                e.val('a').change()
                got.should.eql(true)
            })
        })

        describe('remove', () => {
            it('removes the element from the plated result', () => {
                var k = tem.span()
                var p = tem.div().append(k).plate

                p.find('span').length.should.eql(1)
                k.remove()
                p.find('span').length.should.eql(0)
            })
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

        describe('ol', () => {
            it('allows li elements as children', () => {
                tem.ol().append(tem.li()).plate
                    .find('li').length
                    .should.equal(1)
            })
        })

        describe('ul', () => {
            it('allows li elements as children', () => {
                tem.ul().append(tem.li()).plate
                    .find('li').length
                    .should.equal(1)
            })
        })

        describe('text', () => {
            it('sets text of container', () => {
                tem.div().text('aaa').plate
                    .text()
                    .should.equal('aaa')
            })

            it('throws if both children and text are set', () => {

                (() => {
                    tem.div().append(tem.div().text('bbb')).text('aaa')
                }).should.throw('Cannot set both children and text for element')
            })
        })

        describe('select', () => {
            it('allows only options as children', () => {
                tem.select()
                    .append(tem.option('v'))
                    .plate
                    .find('option')
                    .length
                    .should.equal(1)
            })

            describe('option', () => {
                it('stringifies json object to value', () => {
                    var opt = tem.option({foo: 1})
                    tem.select()
                        .append(opt)
                        .plate
                        .find('option').attr('value')
                        .should.equal('{"foo":1}')
                })

                it('leaves strings as is', () => {
                    tem.select().append(tem.option('abc'))
                        .plate.find('option').attr('value')
                        .should.equal('abc')
                })

                it('can be followed by other options', () => {
                    tem.option('').followedBy(tem.option('')).plate
                        .length
                        .should.eql(2)
                })
            })
        })
    })
})
