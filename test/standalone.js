var assert = require('assert');
var stringify = require('./helpers/stringify');
var List = require('../lib/common/List');
var parse = require('../lib/parser');
var walk = require('../lib/walker');
var generate = require('../lib/generator');
var convertor = require('../lib/convertor');

var css = '.a{}';
var expectedAst = {
    type: 'StyleSheet',
    children: [
        {
            type: 'Rule',
            prelude: {
                type: 'SelectorList',
                children: [
                    {
                        type: 'Selector',
                        children: [
                            {
                                type: 'ClassSelector',
                                name: 'a'
                            }
                        ]
                    }
                ]
            },
            block: {
                type: 'Block',
                children: []
            }
        }
    ]
};

describe('logical parts as standalone modules', function() {
    var ast;
    beforeEach(function() {
        ast = parse(css);
    });

    it('parser', function() {
        assert.equal(stringify(ast), stringify(expectedAst));
    });

    it('generator', function() {
        assert.equal(generate(ast), css);
    });

    it('walker', function() {
        var types = [];

        walk(ast, function(node) {
            types.push(node.type);
        });

        assert.deepEqual(types, [
            'StyleSheet',
            'Rule',
            'SelectorList',
            'Selector',
            'ClassSelector',
            'Block'
        ]);
    });

    it('convertor', function() {
        assert.equal(ast.children instanceof List, true);
        assert.equal(ast.children.first.prelude.children instanceof List, true);

        convertor.toPlainObject(ast);

        assert.equal(Array.isArray(ast.children), true);
        assert.equal(Array.isArray(ast.children[0].prelude.children), true);

        convertor.fromPlainObject(ast);

        assert.equal(ast.children instanceof List, true);
        assert.equal(ast.children.first.prelude.children instanceof List, true);
    });
});
