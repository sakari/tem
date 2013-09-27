///<reference path="common.d.ts" />

export class Plate {
    constructor(private _str?: String) {}

    get plate(): String {
        return this._str ? this._str : ''
    }
}

export class Tag {
    constructor( private _tag: String
                 , private _attr: Array<{attr: String; value: String}>) {
    }

    public id(id: String) {
        return new Tag(this._tag, this._attr.concat([{attr: 'id', value: id}]))
    }

    get plate(): String {
        var attrs = this._attr.map((a) => {
            return a.attr + '="' + a.value + '"'
        }).join('')

        return '<' + this._tag + ' ' + attrs + '/>'
    }
}

export class TagContainer {
    constructor(private _tag: String
                , private _children: Array<Plate>
                , private _attr: Array<{attr: String; value: String}>) {
    }

    public id(id: String) {
        return new TagContainer(this._tag
                                , this._children
                                , this._attr.concat([{attr: 'id', value: id }]))
    }

    public child(child: Plate) {
        return new TagContainer(this._tag
                                , this._children.concat([child])
                                , this._attr)
    }

    get plate(): String {
        var attrs = this._attr.map((a) => {
            return a.attr + '="' + a.value + '"'
        }).join('')

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

export var variable = () => { return new Variable() }
export var plate = ''
export var div = new TagContainer('div', [], [])
export var span = new TagContainer('span', [], [])
export var p = new TagContainer('p', [], [])
export var input = {
    text: new Tag('input', [{attr: 'type', value: 'text'}])
}