///<reference path="common.d.ts" />

export interface Plate {
    plate: String
}

export class Tag implements TagLike {
    _isTag: boolean

    constructor( public _tag: String
                 , public _attr: Array<{attr: String; value: String}>) {
    }

    get plate(): String {
        var attrs = this._attr.map((a) => {
            return a.attr + '="' + a.value + '"'
        }).join(' ')

        return '<' + this._tag + ' ' + attrs + '/>'
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

export class TagContainer extends Tag {
    constructor(_tag: String
                , private _children: Array<TagLike>
                , _attr: Array<{attr: String; value: String}>) {
        super(_tag, _attr)
    }

    public child(child: TagLike) {
        this._children.push(child)
        return this
    }


    get plate(): String {
        var attrs = this._attr.map((a) => {
            return a.attr + '="' + a.value + '"'
        }).join(' ')

        var children = this._children.map((c) => {
            return c.plate
        }).join('')
        return '<' + this._tag + ' ' + attrs + '>' + children +'</' + this._tag +'>'
    }
}

export class JointPlate implements TagLike{
    _isTag: boolean

    constructor(private _l: TagLike, private _r: TagLike) {}

    get plate(): String {
        return this._l.plate + '' + this._r.plate
    }
}

export interface TagLike extends Plate{
    _isTag: boolean;
}

export class TagVar implements TagLike{
    _isTag: boolean

    constructor(private _t?: Tag) {}

    set(t: Tag) {
        this._t = t
        return this
    }

    get plate() {
        return this._t.plate
    }

    join(v: TagVar) {
        return new JointPlate(this, v)
    }
}

export class OptVar<T> implements OptionLike<T> {
    _isOption: boolean
    _isTag: boolean

    constructor(private _t?: Option<T>) {}

    set(t: Option<T>) {
        this._t = t
        return this
    }

    get plate() {
        return this._t.plate
    }

    join(v: OptVar<T>) {
        return new JointPlate(this, v)
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
    _children: Array<OptionLike<T>>

    constructor() {
        super('select', [])
        this._children = []
    }

    child(opt: OptionLike<T>) {
        this._children.push(opt)
        return this
    }

    get plate(): String {
        return new TagContainer('select', this._children, this._attr).plate
    }
}

export interface OptionLike<T> extends TagLike {
    _isOption: boolean
}

export class Option<T> extends TagContainer implements OptionLike<T>{
    _isOption: boolean

    constructor() {
        super('option', [], [])
    }

    value(t: T) {
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

export var plate = ''

export var select = () => { return new Select() }
export var option = () => { return new Option() }
export var div = () => { return new TagContainer('div', [], []) }
export var span = () => { return new TagContainer('span', [], []) }
export var p = () => { return new TagContainer('p', [], [])}
export var input = {
    text: () => { return new Input<String>('text') }
    , number: () => { return new Input<number>('number') }
}