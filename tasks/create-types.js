var handlebars = require('handlebars')
var fs = require('fs')


module.exports = function(grunt) {
    handlebars.registerHelper('containerLike', function(t, kind, siblings, children, valueType) {
        if(typeof valueType !== 'string')
            valueType = undefined
        var tagName = t.replace(/<.*/, '').toLowerCase()
        var generic = t.replace(/^[^<]*/, '')
        var exportName = tagName + generic
        return handlebars
            .compile(fs.readFileSync('templates/containerLike.ts', 'utf8'))({
                className: t,
                extending: 'base.Container<' + children  + ', ' + siblings + '>',
                kind: kind,
                children: children,
                siblings: siblings,
                valueType: valueType,
                tagName: tagName,
                exportName: exportName
            })
    })

    handlebars.registerHelper('elementLike', function(t, kind, siblings, valueType) {
        if(typeof valueType !== 'string')
            valueType = undefined
        var tagName = t.replace(/<.*/, '').toLowerCase()
        var generic = t.replace(/^[^<]*/, '')
        var exportName = tagName + generic

        return handlebars
            .compile(fs.readFileSync('templates/elementLike.ts', 'utf8'))({
                className: t,
                extending: 'base.Element<' + siblings  + '>',
                kind: kind,
                siblings: siblings,
                valueType: valueType,
                tagName: tagName,
                exportName: exportName
            })
    })

    handlebars.registerHelper('value', function(v) {
        return handlebars
            .compile(fs.readFileSync('templates/value.ts', 'utf8'))({
                valueType: v
            })
    })
    handlebars.registerHelper('container', function(thisClass, children) {
        return handlebars
            .compile(fs.readFileSync('templates/container.ts', 'utf8'))({
                className: thisClass,
                children: children
            })
    })

    handlebars.registerHelper('element', function(thisClass, siblings) {
        return handlebars
            .compile(fs.readFileSync('templates/element.ts', 'utf8'))({
                className: thisClass,
                siblings: siblings
            })
    })
    var tem = handlebars
                .compile(fs.readFileSync('templates/types.ts', 'utf8'))()
    fs.writeFileSync('src/tem.ts', tem)
}
