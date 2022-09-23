import { Delim } from '../../tokenizer';

const LESS_THAN_SIGN = 0x003C; // U+003C LESS-THAN SIGN (<)
const GREATER_THAN_SIGN = 0x003E;  // U+003E GREATER-THAN-SIGN (>)
const EQUALS_SIGN = 0x003D; // U+003D EQUALS SIGN (=)

// '=', '>', '>=', '<', '<='
export const name = 'Comparator';
export const structure = {
    value: String
};

export function parse() {
    let start = this.tokenStart;
    let comparator;
    if (this.isDelim(LESS_THAN_SIGN) || this.isDelim(GREATER_THAN_SIGN)) {
        comparator = this.consume(Delim);
        if (this.isDelim(EQUALS_SIGN)) {
            comparator += this.consume(Delim);
        }
    } else if (this.isDelim(EQUALS_SIGN)) {
        comparator = this.consume(Delim);
    } else {
        this.error('Expected: One of the following comparators =, >, >=, < or <=');
    }
    return {
        type: 'Comparator',
        loc: this.getLocation(start, this.tokenStart),
        value: comparator
    };
}

export function generate(node) {
    this.tokenize(node.value);
}
