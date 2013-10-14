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

export class Element<S extends Plate> implements Plate {
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

export class Tag<S extends TagLike> extends Element<S> implements TagLike {
    _isTag: boolean
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

export class Container<C extends Plate, S extends Plate> extends Element<S> {
    _contained: HasChildren<C>;
    _text: String

    constructor(tag: String, attr: Array<{attr: String; value: String}>) {
        super(tag, attr)
        this._contained = new HasChildren()
    }

    public child(child: C) {
        this._contained.add(child)
        return this
    }

    public text(text: String) {
        this._text = text
        return this
    }

    get plate(): JQuery {
        return this.getPlate()
    }

    public getPlate(): JQuery {
        var e = super.getPlate()
        if(this._text)
            e.text(this._text)
        this._contained.plate(e.first())
        return e
    }
}

export class TagContainer<C extends TagLike, S extends TagLike>
    extends Container<C, S> implements TagLike{
        _isTag: boolean

        public child(child: C) {
            super.child(child)
            return this
        }

        public followedBy(s: S) {
            super.followedBy(s)
            return this
        }

        public id(str: String) {
            super.id(str)
            return this
        }

        public text(t: String) {
            super.text(t)
            return this
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
    extends Container<C, S> implements TagLike {
        _isTag: boolean

        constructor() {
            super('select', [])
        }

        public child(child: C) {
            super.child(child)
            return this
        }

        public followedBy(s: S) {
            super.followedBy(s)
            return this
        }

        public id(str: String) {
            super.id(str)
            return this
        }

        public text(t: String) {
            super.text(t)
            return this
        }

    }

export interface OptionLike<T> extends Plate {
    _isOption: boolean
}

export class Option<V, C extends TagLike, S extends OptionLike<V> >
    extends Container<C, S> implements OptionLike<V>{
        _isOption: boolean

        constructor() {
            super('option', [])
        }

        public child(child: C) {
            super.child(child)
            return this
        }

        public followedBy(s: S) {
            super.followedBy(s)
            return this
        }

        public id(str: String) {
            super.id(str)
            return this
        }

        public text(t: String) {
            super.text(t)
            return this
        }

    value(t: V) {
        if(typeof t === 'string')
            this._addAttr('value', '' + t)
        else
            this._addAttr('value', JSON.stringify(t))
        return this
    }
}

export interface LiLike extends Plate {
    _isLi: boolean
}
export class Li<C extends TagLike, S extends LiLike>
    extends Container<C, S> implements LiLike {
        _isLi: boolean

        constructor() {
            super('li', [])
        }

        public child(child: C) {
            super.child(child)
            return this
        }

        public followedBy(s: S) {
            super.followedBy(s)
            return this
        }

        public id(str: String) {
            super.id(str)
            return this
        }

        public text(t: String) {
            super.text(t)
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

export class LiContainer<C extends LiLike, S extends TagLike>
    extends Container<C, S> implements TagLike {
        _isTag: boolean

        public child(child: C) {
            super.child(child)
            return this
        }

        public followedBy(s: S) {
            super.followedBy(s)
            return this
        }

        public id(str: String) {
            super.id(str)
            return this
        }

        public text(t: String) {
            super.text(t)
            return this
        }
    }

export function ol(): LiContainer<LiLike, TagLike> {
    return new LiContainer('ol', [])
}

export function ul(): LiContainer<LiLike, TagLike> {
    return new LiContainer('ul', [])
}

export function li(): Li<TagLike, LiLike> {
    return new Li()
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
