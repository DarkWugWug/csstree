import {
    Ident,
    String as StringToken,
    Number as NumberToken,
    Function as FunctionToken,
    Url,
    Hash,
    Dimension,
    Percentage,
    LeftParenthesis,
    LeftSquareBracket,
    Comma,
    Delim
} from '../../tokenizer/index.js';

const NUMBERSIGN = 0x0023;          // U+0023 NUMBER SIGN (#)
const ASTERISK = 0x002A;            // U+002A ASTERISK (*)
const PLUSSIGN = 0x002B;            // U+002B PLUS SIGN (+)
const HYPHENMINUS = 0x002D;         // U+002D HYPHEN-MINUS (-)
const SOLIDUS = 0x002F;             // U+002F SOLIDUS (/)
const LESS_THAN_SIGN = 0x003C;      // U+003C LESS-THAN SIGN (<)
const EQUALS_SIGN = 0x003D;         // U+003D EQUALS SIGN (=)
const GREATER_THAN_SIGN = 0x003E;   // U+003E GREATER-THAN-SIGN (>)
const U = 0x0075;                   // U+0075 LATIN SMALL LETTER U (u)

export default function defaultRecognizer(context) {
    switch (this.tokenType) {
        case Hash:
            return this.Hash();

        case Comma:
            return this.Operator();

        case LeftParenthesis:
            return this.Parentheses(this.readSequence, context.recognizer);

        case LeftSquareBracket:
            return this.Brackets(this.readSequence, context.recognizer);

        case StringToken:
            return this.String();

        case Dimension:
            return this.Dimension();

        case Percentage:
            return this.Percentage();

        case NumberToken:
            return this.Number();

        case FunctionToken:
            return this.cmpStr(this.tokenStart, this.tokenEnd, 'url(')
                ? this.Url()
                : this.Function(this.readSequence, context.recognizer);

        case Url:
            return this.Url();

        case Ident:
            // check for unicode range, it should start with u+ or U+
            if (this.cmpChar(this.tokenStart, U) &&
                this.cmpChar(this.tokenStart + 1, PLUSSIGN)) {
                return this.UnicodeRange();
            } else {
                return this.Identifier();
            }

        case Delim: {
            const code = this.charCodeAt(this.tokenStart);
            switch (code) {
                case SOLIDUS:
                case ASTERISK:
                case PLUSSIGN:
                case HYPHENMINUS:
                    return this.Operator();
                case LESS_THAN_SIGN:
                case EQUALS_SIGN:
                case GREATER_THAN_SIGN:
                    return this.Comparator();
                case NUMBERSIGN:
                    // TODO: produce a node with Delim node type
                    this.error('Hex or identifier is expected', this.tokenStart + 1);
            }
            break;
        }
    }
};
