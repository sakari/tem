public value(v: {{{valueType}}}) {
    var k: any = v
    if(typeof k === 'string') {
        this._plated.val(k)
    } else {
        this._plated.val(JSON.stringify(k))
    }
}