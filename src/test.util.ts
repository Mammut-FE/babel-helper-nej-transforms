import generator from '@babel/generator';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { Statement } from '@babel/types';
import { Options } from './options.interface';
import { NejMeta } from './parser/interfaces/nej-meta.interface';
import { nejCodeParser } from './parser/nej-code-parser';

export function getNejParseResult(code): Promise<NejMeta> {
    return new Promise(resolve => {
        const ast = parser.parse(code);
        const options: Options = {
            alias: {},
            isNejCode: true
        };

        traverse(ast, {
            enter: (path) => {
                resolve(nejCodeParser(path, options));
            }
        });
    });
}

export function generatorCode(statements: Statement[]): string {
    const ast = parser.parse('');
    ast.program.body = statements;
    return generator(ast).code;
}

export function expectCodeEqual(expected: string, received: string) {
    expected = expected.trim().split('\n').map(line => line.trim()).filter(line => line.trim()).join('\n');
    received = received.trim().split('\n').map(line => line.trim()).filter(line => line.trim()).join('\n');

    expect(expected).toEqual(received);
}
