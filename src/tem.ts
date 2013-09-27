///<reference path="common.d.ts" />

export class Plate {
    constructor(private _str?: String) {}

    get plate(): String {
        return this._str ? this._str : ''
    }
}

export class Tag implements Element {
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
            this._attr.push({attr: attr, value: value})
        return this
    }
}

export class TagContainer extends Tag {
    constructor(_tag: String
                , private _children: Array<Element>
                , _attr: Array<{attr: String; value: String}>) {
        super(_tag, _attr)
    }

    public child(child: Element) {
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

export class JointPlate implements Element{
    _isTag: boolean

    constructor(private _l: Element, private _r: Element) {}

    get plate(): String {
        return this._l.plate + '' + this._r.plate
    }
}

export interface Element {
    _isTag: boolean;
    plate: String;
}

export class Variable implements Element {
    _isTag: boolean;

    constructor(private _t?: Tag) {}

    set(t: Tag) {
        this._t = t
        return this
    }

    get plate() {
        return this._t.plate
    }

    join(v: Variable) {
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

export class Select extends Tag implements Element {
    _children: Array<Option>

    constructor() {
        super('select', [])
        this._children = []
    }

    child(opt: Option) {
        this._children.push(opt)
        return this
    }

    get plate(): String {
        return new TagContainer('select', this._children, this._attr).plate
    }
}

export class Option extends TagContainer {
    _isOption: boolean

    constructor() {
        super('option', [], [])
    }
}

export var variable = () => { return new Variable() }
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