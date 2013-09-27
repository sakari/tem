///<reference path="common.d.ts" />

var should = require('should')
import should = require('should')
import tem = require('../src/tem')

describe('tem', () => {
    describe('html element templating', () => {

        it('produces empty string for empty template', () => {
            tem.plate.should.equal('')
        })

        it('allows setting id of element', () => {
            tem.div().id('id').plate.should.eql('<div id="id"></div>')
        })

        it('allows setting child elements', () => {
            tem.div().child(tem.div()).plate
                .should.eql('<div ><div ></div></div>')
        })

        it('allows setting classes', () => {
            tem.div().class('c1').class('c2').plate
                .should.equal('<div class="c1 c2"></div>')
        })

        it('provides these html elements', () => {
            tem.div().plate.should.equal('<div ></div>')
            tem.p().plate.should.equal('<p ></p>')
            tem.span().plate.should.eql('<span ></span>')
            tem.input.text().plate.should.eql('<input type="text"/>')
        })

        describe('followedBy', () => {
            it('joins tags together', () => {
                tem.div()
                    .followedBy(tem.span())
                    .followedBy(tem.div())
                    .plate
                    .should.equal('<div ></div><span ></span><div ></div>')
            })
        })

        describe('input elements', () => {
            it('allows setting string value to text input', () => {
                tem.input.text()
                    .value("abc")
                    .plate
                    .should.equal('<input type="text" value="abc"/>')
            })

            it('allows setting number value to number input', () => {
                tem.input.number()
                    .value(1)
                    .plate
                    .should.equal('<input type="number" value="1"/>')
            })
        })

        describe('select', () => {
            it('allows only options as children', () => {
                tem.select()
                    .child(tem.option())
                    .plate
                    .should.eql('<select ><option ></option></select>')
            })

            it('allows option variable as child', () => {
                var v = tem.variable.opt()
                v.set(tem.option())
                tem.select()
                    .child(v)
                    .plate
                    .should.equal('<select ><option ></option></select>')
            })

            describe('option', () => {
                it('stringifies json object to value', () => {
                    var opt = tem.option().value({ foo: 1})
                    tem.select()
                        .child(opt)
                        .plate
                        .should.equal('<select ><option value="{\"foo\":1}"></option></select>')
                })

                it('leaves strings as is', () => {
                    tem.select().child(tem.option().value('abc')).plate
                        .should.equal('<select ><option value="abc"></option></select>')
                })

                it('can be followed by other options', () => {
                    tem.option().followedBy(tem.option()).plate
                        .should.eql('<option ></option><option ></option>')
                })

                it('can be followed by option vars', () => {
                    var o = tem.variable.opt()
                    o.set(tem.option())
                    tem.option().followedBy(o).plate
                        .should.eql('<option ></option><option ></option>')
                })
            })
        })
    })

    describe('variables', () => {
        it('variables are substituted', () => {
            var v = tem.variable.tag()
            var t = tem.div().child(v)
            v.set(tem.div())
            t.plate.should.eql('<div ><div ></div></div>')
        })
    })
})
