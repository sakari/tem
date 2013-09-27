///<reference path="common.d.ts" />

export class Plate {
    get plate(): String {
        return ''
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

    get plate() {
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

    public childVar(child: Variable<Tag>) {
        return this._child(child)
    }

    public id(id: String) {
        return new TagContainer(this._tag, this._children, id)
    }

    public child(child: Tag) {
        return this._child(child)
    }

    private _child(child: any) {
        var children = this._children
        if(children === undefined)
            children = []
        return new TagContainer(this._tag, children.concat([child]), this._id)
    }

    get plate() {
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

declare class TagContainer {
    public child(child: Variable<Tag>): TagContainer
}


export class Variable<T extends Plate> {
    constructor(private _t?: T) {
    }
    set(t: T) {
        this._t = t
    }
    get plate() {
        return this._t.plate
    }
}

export var variable = () => { return new Variable() }
export var plate = ''
export var div = new TagContainer('div')
