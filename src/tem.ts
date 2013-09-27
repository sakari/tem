///<reference path="common.d.ts" />

export class Plate {
    constructor(private _str?: String) {}

    get plate(): String {
        return this._str ? this._str : ''
    }
}

export class Tag {
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
                , private _children: Array<Plate>
                , _attr: Array<{attr: String; value: String}>) {
        super(_tag, _attr)
    }

    public child(child: Plate) {
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

export class JointPlate {
    constructor(private _l: Plate, private _r: Plate) {}

    get plate(): String {
        return this._l.plate + '' + this._r.plate
    }
}

export class Variable {
    constructor(private _t?: Plate) {}

    set(t: Plate) {
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

export var variable = () => { return new Variable() }
export var plate = ''
export var div = () => { return new TagContainer('div', [], []) }
export var span = () => { return new TagContainer('span', [], []) }
export var p = () => { return new TagContainer('p', [], [])}
export var input = {
    text: () => { return new Input<String>('text') }
    , number: () => { return new Input<number>('number') }
}