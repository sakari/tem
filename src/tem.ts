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
    public _next: NextTags<S>;
    public _plated: JQuery;

    constructor(public _tag: String
                 , public _attr: Array<{attr: String; value: String}>) {
        this._next = new NextTags()
        this._plated = $('<' + this._tag + '>')
    }

    public followedBy(next: S) {
        this._next.followedBy(next)
        return this
    }

    public get plate(): JQuery {
        return this.getPlate()
    }

    public getPlate(): JQuery {
        return this._next.plate(this._plated)
    }

    public id(id: string) {
        this._plated.attr('id', id)
        return this
    }

    public remove() {
        this._plated.remove()
    }

    public class(c: string) {
        this._plated.addClass(c)
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
    constructor(tag: String, attr: Array<{attr: String; value: String}>) {
        super(tag, attr)
    }

    public append(child: C) {
        if(this._plated.text())
            throw new Error('Cannot set both children and text for element')
        this._plated.append(child.plate)
        return this
    }

    public text(text: String) {
        if(this._plated.children().length > 0)
            throw new Error('Cannot set both children and text for element')
        this._plated.text(text)
        return this
    }
}

export class TagContainer<C extends TagLike, S extends TagLike>
    extends Container<C, S> implements TagLike{
        _isTag: boolean

        public append(child: C) {
            super.append(child)
            return this
        }

        public followedBy(s: S) {
            super.followedBy(s)
            return this
        }

        public id(str: string) {
            super.id(str)
            return this
        }

        public text(t: string) {
            super.text(t)
            return this
        }

    }

export interface TagLike extends Plate{
    _isTag: boolean;
}

export class Input<V, S extends TagLike> extends Tag<S> {
    constructor(type: String) {
        super('input', [{attr: 'type', value: type}])
    }

    value(t: V) {
        this._plated.val('' + t)
        return this
    }
}

export class Select<V, C extends OptionLike<V>, S extends TagLike>
    extends Container<C, S> implements TagLike {
        _isTag: boolean

        constructor() {
            super('select', [])
        }

        public append(child: C) {
            super.append(child)
            return this
        }

        public followedBy(s: S) {
            super.followedBy(s)
            return this
        }

        public id(str: string) {
            super.id(str)
            return this
        }

        public text(t: string) {
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

        public append(child: C) {
            super.append(child)
            return this
        }

        public followedBy(s: S) {
            super.followedBy(s)
            return this
        }

        public id(str: string) {
            super.id(str)
            return this
        }

        public text(t: string) {
            super.text(t)
            return this
        }

    value(t: V) {
        var k: any = t
        if(typeof k === 'string') {
            this._plated.val(k)
        } else {
            this._plated.val(JSON.stringify(t))
        }
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

        public append(child: C) {
            super.append(child)
            return this
        }

        public followedBy(s: S) {
            super.followedBy(s)
            return this
        }

        public id(str: string) {
            super.id(str)
            return this
        }

        public text(t: string) {
            super.text(t)
            return this
        }

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

        public append(child: C) {
            super.append(child)
            return this
        }

        public followedBy(s: S) {
            super.followedBy(s)
            return this
        }

        public id(str: string) {
            super.id(str)
            return this
        }

        public text(t: string) {
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
