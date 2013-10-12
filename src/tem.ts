///<reference path="common.d.ts" />

var $ = require('../../lib/jquery')
export interface Plate {
    plate: JQuery
}

export class NextTags<T extends Plate> {
    _next: Array<T>

    constructor() {
        this._next = []
    }

    public followedBy(next: T) {
        this._next.push(next)
        return this
    }

    public plate(e: JQuery): JQuery {
        var workaround = $('<div>')
        workaround.append(e)
        workaround.append(this._next.map((n) => {
            return n.plate
        }))
        return workaround.children()
    }
}

export class Tag<S extends TagLike> implements TagLike {
    _isTag: boolean

    public _next: NextTags<S>

    constructor(public _tag: String
                 , public _attr: Array<{attr: String; value: String}>) {
        this._next = new NextTags()
    }

    public followedBy(next: S) {
        this._next.followedBy(next)
        return this
    }

    public get plate(): JQuery {
        return this.getPlate()
    }

    public getPlate(): JQuery {
        var e = $('<' + this._tag + '/>') 
        this._attr.map((a) => {
            e.attr(a.attr, a.value)
        })
        return this._next.plate(e)
    }

    public id(id: String) {
        this._attr.push({attr: 'id', value: id })
        return this
    }

    public class(c: String) {
        return this._mergeAttr('class', c) 
    }

    _addAttr(attr: String, value: String) {
        this._attr.push({attr: attr, value: value})
    }

    _mergeAttr(attr: String, value: String) {
        var found = false
        this._attr.map((a) => {
            if(a.attr !== attr)
                return
            found = true
            a.value = a.value + ' ' + value
            return
        })
        if(!found)
            this._addAttr(attr, value)
        return this
    }
}

export class HasChildren<T extends Plate> {
    _children: Array<T>

    constructor() {
        this._children = []
    }

    add(child: T) {
        this._children.push(child)
    }

    plate(e: JQuery) {
        var children = this._children.map((c: TagLike) => {
            return c.plate
        })
        e.append(children)
        return e
    }
}

export class TagContainer<C extends TagLike, S extends TagLike> extends Tag<S> {
    _contained: HasChildren<C>

    constructor(tag: String, attr: Array<{attr: String; value: String}>) {
        super(tag, attr)
        this._contained = new HasChildren()
    }

    public child(child: C) {
        this._contained.add(child)
        return this
    }

    get plate(): JQuery {
        return this.getPlate()
    }

    public getPlate(): JQuery {
        var e = super.getPlate()
        this._contained.plate(e.first())
        return e
    }
}

export interface TagLike extends Plate{
    _isTag: boolean;
}


export class TagVar<S extends TagLike> implements TagLike{
    _isTag: boolean;

    constructor(private _t?: Tag<S>) {
    }

    set(t: Tag<S>) {
        this._t = t
        return this
    }

    get plate(): JQuery {
        return this._t.plate
    }
}

export class OptVar<V, C extends TagLike, S extends OptionLike<V>> 
    implements OptionLike<V> {
        _isOption: boolean
        _isTag: boolean

        constructor(private _t?: Option<V, C, S>) {
        }

        set(t: Option<V, C, S>) {
            this._t = t
            return this
        }

        get plate(): JQuery {
            return this._t.plate
        }
    }

export class Input<V, S extends TagLike> extends Tag<S> {
    constructor(type: String) {
        super('input', [{attr: 'type', value: type}])
    }

    value(t: V) {
        this._attr.push({attr: 'value', value: '' + t})
        return this
    }
}

export class Select<V, C extends OptionLike<V>, S extends TagLike> 
    extends TagContainer<C, S> implements TagLike {
    constructor() {
        super('select', [])
    }
}

export interface OptionLike<T> extends TagLike {
    _isOption: boolean
}

export class Option<V, C extends TagLike, S extends OptionLike<V> > 
    extends TagContainer<C, S> implements OptionLike<V>{
    _isOption: boolean

    constructor() {
        super('option', [])
    }

    value(t: V) {
        if(typeof t === 'string')
            this._addAttr('value', '' + t)
        else
            this._addAttr('value', JSON.stringify(t))
        return this
    }
}

export var variable = {
    tag: () => { return new TagVar() }
    , opt: () => { return new OptVar() }
}

export var plate = $()

export function select<V>(): Select<V, OptionLike<V>, TagLike>{
    return new Select()
}

export function option<V>(): Option<V, TagLike, OptionLike<V>> {
    return new Option()
}

export function div(): TagContainer<TagLike, TagLike> {
    return new TagContainer('div', [])
}

export function span(): TagContainer<TagLike, TagLike> {
    return new TagContainer('span', [])
}

export function p(): TagContainer<TagLike, TagLike> {
    return new TagContainer('p', [])
}

export var input = {
    text: () => { return new Input<String>('text') }
    , number: () => { return new Input<number>('number') }
}
