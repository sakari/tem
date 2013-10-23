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

    constructor(public _tag: String) {
        this._next = new NextTags()
        this._plated = $('<' + this._tag + '>')
    }

    public _attr(attr: string, value: string) {
        this._plated.first().attr(attr, value)
        return this
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

    public bind(fn: (v: Element<S>) => void) {
        fn(this)
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

export class HasChildren<T extends Plate> {
    _children: Array<T>

    constructor() {
        this._children = []
    }

    add(child: T) {
        this._children.push(child)
    }

    plate(e: JQuery) {
        var children = this._children.map((c: Plate) => {
            return c.plate
        })
        e.append(children)
        return e
    }
}

export class Container<C extends Plate, S extends Plate> extends Element<S> {
    constructor(tag: String) {
        super(tag)
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
