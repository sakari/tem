///<reference path="common.d.ts" />

export class Plate {
    get plate(): String {
        return ''
    }
}


export class Tag extends Plate {
    constructor(private _tag: String
                , private _children?: Array<Plate>
                , private _id?: String) {
        super()
    }

    public id(id: String) {
        return new Tag(this._tag, this._children, id)
    }

    public child(child: Plate) {
        var children = this._children
        if(children === undefined)
            children = []
        return new Tag(this._tag, children.concat([child]), this._id)
    }

    get plate() {
        var id = ''
        var children =''
        if(this._id !== undefined) {
            id = ' id="' + this._id + '"'
        }
        if(this._children !== undefined) {
            children = this._children.map((c) => { return c.plate }).join('')
        }
        return '<' + this._tag + id + '>' + children +'</' + this._tag +'>'
    }
}

export class Div extends Tag {
    constructor() {
        super('div')
    }
}

export var div = new Div()