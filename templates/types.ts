///<reference path="common.d.ts">
import base = require('base')
var $ = require('../../lib/jquery')

export interface TagLike extends base.Plate {
    _isTag: boolean;
}

export interface OptionLike<V> extends base.Plate {
    _isOption: boolean
}

{{{containerLike 'Span' 'Tag' 'TagLike' 'TagLike'}}}
{{{containerLike 'Div' 'Tag' 'TagLike' 'TagLike' }}}
{{{containerLike 'Select<V>' 'Tag' 'TagLike' 'OptionLike<V>' 'V'}}}

export class Option<V> extends base.Container<TagLike, OptionLike<V>> implements OptionLike<V> {
    _isOption: boolean;

    constructor(private _value: V) {
        super('option')
    }
    {{{container 'Option<V>' 'TagLike'}}}
    {{{element 'Option<V>' 'OptionLike<V>'}}}


    public get plate(): JQuery {
        return this.getPlate()
    }

    public getPlate() {
        var e = super.getPlate()
        var k: any = this._value
        if(typeof k !== 'string') {
            k = JSON.stringify(k)
        }
        e.first().attr('value', k)
        return e
    }
}

export function option<V>(v: V): Option<V> { return new Option(v) }

{{{containerLike 'Ol' 'Tag' 'TagLike' 'Li' }}}
{{{containerLike 'Ul' 'Tag' 'TagLike' 'Li' }}}
{{{containerLike 'Li' 'Li' 'Li' 'TagLike' }}}
{{{containerLike 'P' 'Tag' 'TagLike' 'TagLike' }}}

export class Input<V> extends base.Element<TagLike> {
    constructor(type: string) {
        super('input')
        this._attr('type', type)
    }
    {{{element 'Input<V>' 'TagLike'}}}

    public value(v: V) {
        this._plated.val('' + v)
        return this
    }
}

export var input = {
    'number': () => { return new Input<number>('number') },
    'text': () => { return new Input<string>('text') }
}
export var plate: JQuery = $()
