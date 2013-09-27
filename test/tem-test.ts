///<reference path="common.d.ts" />

var should = require('should')
import should = require('should')
import tem = require('../src/tem')

describe('tem', () => {
    describe('html element templating', () => {

        it('produces empty string for empty template', () => {
            tem.plate.should.equal('')
        })

        it('produces strings', () => {
            tem.div.plate.should.equal('<div></div>')
        })

        it('allows setting id of element', () => {
            tem.div.id('id').plate.should.eql('<div id="id"></div>')
        })

        it('allows setting child elements', () => {
            tem.div.child(tem.div).plate
                .should.eql('<div><div></div></div>')
        })
    })

    describe('variables', () => {
        it('variables are substituted', () => {
            var v = tem.variable()
            var t = tem.div.childVar(v)
            v.set(tem.div)
            t.plate.should.eql('<div><div></div></div>')
        })
    })
})
