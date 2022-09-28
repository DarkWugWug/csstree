import { parse } from 'css-tree';
import { promises as fs } from 'fs';

const cssFile = './fixtures/stringify.css';
const astFile = './fixtures/stringify.ast';

async function main() {
    const css = await fs.readFile(cssFile);
    const ast = parse(css.toString(), {
        filename: 'stringify.css',
        positions: true
    });
    await fs.writeFile(astFile, JSON.stringify(ast, null, 4));
};

main();
