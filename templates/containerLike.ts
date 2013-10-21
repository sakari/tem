
export class {{{className}}} extends {{{extending}}} {
    _is{{kind}}: boolean;

    constructor() {
        super('{{{tagName}}}')
    }

{{{container className children}}}
{{{element className siblings}}}
{{#if valueType}}
{{{value valueType}}}
{{/if}}
}

export function {{{exportName}}}(): {{{className}}} { return new {{{className}}}() }