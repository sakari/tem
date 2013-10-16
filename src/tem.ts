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

export class Tag extends Element<TagLike> implements TagLike {
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

export class TagContainer
    extends Container<TagLike, TagLike> implements TagLike{
        _isTag: boolean

        public append(child: TagLike) {
            super.append(child)
            return this
        }

        public followedBy(s: TagLike) {
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

export class Input<V> extends Tag {
    constructor(type: String) {
        super('input', [{attr: 'type', value: type}])
    }

    value(t: V) {
        this._plated.val('' + t)
        return this
    }
}

export class Select<V>
    extends Container<OptionLike<V>, TagLike> implements TagLike {
        _isTag: boolean

        constructor() {
            super('select', [])
        }

        public append(child: OptionLike<V>) {
            super.append(child)
            return this
        }

        public followedBy(s: TagLike) {
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

export class Option<V>
    extends Container<TagLike, OptionLike<V>> implements OptionLike<V>{
        _isOption: boolean

        constructor() {
            super('option', [])
        }

        public append(child: TagLike) {
            super.append(child)
            return this
        }

        public followedBy(s: OptionLike<V>) {
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
export class Li
    extends Container<TagLike, LiLike> implements LiLike {
        _isLi: boolean

        constructor() {
            super('li', [])
        }

        public append(child: TagLike) {
            super.append(child)
            return this
        }

        public followedBy(s: LiLike) {
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

export function select<V>(): Select<V> {
    return new Select()
}

export function option<V>(): Option<V> {
    return new Option()
}

export class LiContainer
    extends Container<LiLike, TagLike> implements TagLike {
        _isTag: boolean

        public append(child: LiLike) {
            super.append(child)
            return this
        }

        public followedBy(s: TagLike) {
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

export function ol(): LiContainer {
    return new LiContainer('ol', [])
}

export function ul(): LiContainer {
    return new LiContainer('ul', [])
}

export function li(): Li {
    return new Li()
}

export function div(): TagContainer {
    return new TagContainer('div', [])
}

export function span(): TagContainer {
    return new TagContainer('span', [])
}

export function p(): TagContainer {
    return new TagContainer('p', [])
}

export var input = {
    text: () => { return new Input<String>('text') }
    , number: () => { return new Input<number>('number') }
}
