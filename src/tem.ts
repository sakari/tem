///<reference path="common.d.ts" />

var $ = require('../../lib/jquery')
export interface Plate {
    plate: JQuery
}

export class SingleTag implements TagLike {
    _isTag: boolean

    constructor(public _tag: String
                 , public _attr: Array<{attr: String; value: String}>) {
    }

    public get plate(): JQuery {
        return this.getPlate()
    }

    public getPlate(): JQuery {
        var e = $('<' + this._tag + '/>') 
        this._attr.map((a) => {
            e.attr(a.attr, a.value)
        })
        return e
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

export class NextTags {
    _next: Array<TagLike>

    constructor() {
        this._next = []
    }

    public followedBy(next: TagLike) {
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

export class HasChildren {
    _children: Array<TagLike>

    constructor() {
        this._children = []
    }

    add(child: TagLike) {
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

export class Tag extends SingleTag {
    public _next: NextTags

    constructor( tag: String
                 , attr: Array<{attr: String; value: String}>) {
        super(tag, attr)
        this._next = new NextTags
    }

    get plate(): JQuery {
        return this._next.plate(super.getPlate())
    }

    public followedBy(next: TagLike) {
        this._next.followedBy(next)
        return this
    }
}

export class SingleTagContainer extends SingleTag {
    _contained: HasChildren

    constructor(tag: String, attr: Array<{attr: String; value: String}>) {
        super(tag, attr)
        this._contained = new HasChildren()
    }

    public child(child: TagLike) {
        this._contained.add(child)
        return this
    }

    get plate(): JQuery {
        return this.getPlate()
    }

    public getPlate(): JQuery {
        return this._contained.plate(super.getPlate())
    }
}

export class TagContainer extends Tag {
    _contained: HasChildren

    constructor(_tag: String
                , _attr: Array<{attr: String; value: String}>) {
        super(_tag, _attr)
        this._contained = new HasChildren()
    }

    public child(child: TagLike) {
        this._contained.add(child)
        return this
    }

    get plate(): JQuery {
        return this._next.plate(this._contained.plate(super.getPlate()))
    }
}

export interface TagLike extends Plate{
    _isTag: boolean;
}


export class TagVar implements TagLike{
    _isTag: boolean;

    constructor(private _t?: Tag) {
    }

    set(t: Tag) {
        this._t = t
        return this
    }

    get plate(): JQuery {
        return this._t.plate
    }
}

export class OptVar<T> implements OptionLike<T> {
    _isOption: boolean
    _isTag: boolean

    constructor(private _t?: Option<T>) {
    }

    set(t: Option<T>) {
        this._t = t
        return this
    }

    get plate(): JQuery {
        return this._t.plate
    }

}

export class Input<T> extends Tag {
    constructor(type: String) {
        super('input', [{attr: 'type', value: type}])
    }

    value(t: T) {
        this._attr.push({attr: 'value', value: '' + t})
        return this
    }
}

export class Select<T> extends Tag implements TagLike {
    _contained: HasChildren

    constructor() {
        super('select', [])
        this._contained = new HasChildren()
    }

    option(opt: OptionLike<T>) {
        this._contained.add(opt)
        return this
    }

    get plate(): JQuery {
        var e = super.getPlate()
        return this._contained.plate(super.getPlate())
    }
}

export interface OptionLike<T> extends TagLike {
    _isOption: boolean
}

export class Option<T> extends SingleTagContainer implements OptionLike<T>{
    _isOption: boolean
    _next: NextTags

    constructor() {
        super('option', [])
        this._next = new NextTags()
    }

    followedBy(o: OptionLike<T>) {
        this._next.followedBy(o)
        return this
    }

    value(t: T) {
        if(typeof t === 'string')
            this._addAttr('value', '' + t)
        else
            this._addAttr('value', JSON.stringify(t))
        return this
    }

    get plate(): JQuery {
        var e = super.getPlate()
        return this._next.plate(e)
    }
}

export var variable = {
    tag: () => { return new TagVar() }
    , opt: () => { return new OptVar() }
}

export var plate = $()

export var select = () => { return new Select() }
export var option = () => { return new Option() }
export var div = () => { return new TagContainer('div', []) }
export var span = () => { return new TagContainer('span', []) }
export var p = () => { return new TagContainer('p', [])}
export var input = {
    text: () => { return new Input<String>('text') }
    , number: () => { return new Input<number>('number') }
}