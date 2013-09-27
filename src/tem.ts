///<reference path="common.d.ts" />

export class Plate {
    constructor(private _str?: String) {}

    get plate(): String {
        return this._str ? this._str : ''
    }
}

export class Tag extends Plate {
    constructor( public _tag: String
                 , public _id?: String) {
        super()
    }

    public id(id: String) {
        return new Tag(this._tag, id)
    }

    get plate(): String {
        var id = ''
        if(this._id !== undefined) {
            id = ' id="' + this._id + '"'
        }
        return '<' + this._tag + id + '/>'
    }
}

export class TagContainer extends Tag {
    constructor(_tag: String
                , private _children?: Array<Plate>
                , _id?: String) {
        super(_tag, _id)
    }

    public id(id: String) {
        return new TagContainer(this._tag, this._children, id)
    }

    public child(child: Plate) {
        var children = this._children
        if(children === undefined)
            children = []
        return new TagContainer(this._tag, children.concat([child]), this._id)
    }

    get plate(): String {
        var id = ''
        var children =''
        if(this._id !== undefined) {
            id = ' id="' + this._id + '"'
        }
        if(this._children !== undefined) {
            children = this._children.map((c) => {
                return c.plate
            }).join('')
        }
        return '<' + this._tag + id + '>' + children +'</' + this._tag +'>'
    }
}

export class JointPlate extends Plate {
    constructor(private _l: Plate, private _r: Plate) { super() }

    get plate(): String {
        return this._l.plate + '' + this._r.plate
    }
}

export class Variable extends Plate {
    constructor(private _t?: Plate) { super() }

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
export var div = new TagContainer('div')
