///<reference path="common.d.ts" />

export class Plate {
    get plate(): String {
        return ''
    }
}

export interface TagSet {
    id?: String;
    children?: Array<Plate>;
}

export class Tag extends Plate {
    constructor(private _tag: String, private _set: TagSet) {
        super()
    }

    get plate() {
        var id = ''
        var children =''
        if(this._set && this._set.id !== undefined) {
            id = ' id="' + this._set.id + '"'
        }
        if(this._set && this._set.children !== undefined) {
            children = this._set.children.map((c) => { return c.plate }).join('')
        }
        return '<' + this._tag + id + '>' + children +'</' + this._tag +'>'
    }
}

export class Div extends Tag {
    constructor(set: TagSet) {
        super('div', set)
    }
}

export var div = function(set?: TagSet) { return new Div(set) }