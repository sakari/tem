public bind(fn: (v: {{{className}}}) => void) {
    fn(this)
    return this
}

public followedBy(s: {{{siblings}}}) {
    super.followedBy(s)
    return this
}

public id(str: string) {
    super.id(str)
    return this
}
