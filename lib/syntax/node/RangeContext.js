// https://drafts.csswg.org/mediaqueries-5/#range-context
import { Delim, Dimension, Ident, LeftParenthesis, RightParenthesis } from '../../tokenizer';

export const name = 'RangeContext';
export const structure = {
    a: [String, 'Number', 'Dimension'],
    abComparator: 'Comparator',
    b: [String, 'Number', 'Dimension'],
    bcComparator: ['Comparator', null],
    c: [String, 'Number', 'Dimension', null]
};

export function parse() {
    let a;
    let abComparator;
    let b;
    let bcComparator;
    let c;
    this.eat(LeftParenthesis);
    this.skipSC();
    switch (this.tokenType) {
        case Ident: a = this.Identifier(); break;
        case Number: a = this.Number(); break;
        case Dimension: a = this.Dimension(); break;
        default: this.error(`Expected: Identifier, dimension or number. Given: ${this.TokenType}`);
    }
    this.skipSC();
    abComparator = this.Comparator();
    this.skipSC();
    switch (this.tokenType) {
        case Ident: b = this.Identifier(); break;
        case Number: b = this.Number(); break;
        case Dimension: b = this.Dimension(); break;
        default: this.error(`Expected: Identifier, dimension or number. Given: ${this.TokenType}`);
    }
    this.skipSC();
    if (this.tokenType === RightParenthesis) {
        this.eat(RightParenthesis);
        return { a, abComparator, b };
    }
    bcComparator = this.Comparator();
    if (abComparator.value[0] !== bcComparator.value[0]) {
        if (abComparator.value[0] === '>') {
            this.error(`Expected: Both comparators to be one of a greater-than relationship (> or >=). Given: ${abComparator} and ${bcComparator}`);
        } else if (abComparator.value[0] === '<') {
            this.error(`Expected: Both comparators to be one of a less-than relationship (< or <=). Given: ${abComparator} and ${bcComparator}`);
        }
    }
    this.skipSC();
    switch (this.tokenType) {
        case Number: c = this.Number(); break;
        case Dimension: c = this.Dimension(); break;
        default: this.error(`Expected: Dimension or number. Given: ${this.TokenType}`);
    }
    this.skipSC();
    this.eat(RightParenthesis);
    return { a, abComparator, b, bcComparator, c};
}

export function generate(node) {
    this.token(LeftParenthesis, '(');
    this.tokenize(node.a);
    this.token(Delim, node.abComparator);
    this.tokenize(node.b);
    if (node.bcComparator !== null && node.c !== null) {
        this.token(Delim, node.bcComparator);
        this.tokenize(node.c);
    }
    this.token(RightParenthesis, ')');
}
