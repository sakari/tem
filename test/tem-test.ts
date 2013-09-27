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
            tem.div.id('id').plate.should.eql('<div id="id"></div>')
        })

        it('allows setting child elements', () => {
            tem.div.child(tem.div).plate
                .should.eql('<div ><div ></div></div>')
        })

        it('provides these html elements', () => {
            tem.div.plate.should.equal('<div ></div>')
            tem.p.plate.should.equal('<p ></p>')
            tem.span.plate.should.eql('<span ></span>')
            tem.input.text.plate.should.eql('<input type="text"/>')
        })
    })

    describe('variables', () => {
        it('variables are substituted', () => {
            var v = tem.variable()
            var t = tem.div.child(v)
            v.set(tem.div)
            t.plate.should.eql('<div ><div ></div></div>')
        })

        describe('join', () => {
            it('joins two variables', () => {
                var v = tem.variable()
                var k = tem.variable()
                var joint = v.join(k)
                v.set(new tem.Plate('a'))
                k.set(new tem.Plate('b'))
                joint.plate.should.equal('ab')

                v.set(new tem.Plate('1'))
                k.set(new tem.Plate('2'))
                joint.plate.should.equal('12')
            })
        })
    })
})
