import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { ReturnStatement, VariableDeclaration } from '@babel/types';
import { NejInjectType, NejMeta, nejParser } from '..';

export function getNejParseResult(code): Promise<NejMeta> {
    return new Promise(resolve => {
        const ast = parser.parse(code);

        traverse(ast, {
            enter: (path) => {
                resolve(nejParser(path));
            }
        });
    });
}

describe('nejParser', () => {
    it('nejParser is function', () => {
        expect(nejParser).toBeInstanceOf(Function);
    });

    it('解析非 js 文件时, 返回 {fnBody: undefined, dependence: [], nejInject: []}', async () => {
        await expect(getNejParseResult(`111111`)).resolves.toEqual({fnBody: undefined, dependence: [], nejInject: []});
    });

    it('正确解析主体函数', async () => {
        const code = `
            define(['base/util', './global', '{platform}element.js'], function() {
                var _p = {};
                
                return _p;
            })
        `;
        const {fnBody} = await getNejParseResult(code);

        expect(fnBody.length).toEqual(2);
        expect(fnBody[0].type).toEqual('VariableDeclaration');
        expect(fnBody[1].type).toEqual('ReturnStatement');
    });

    it('正确解析依赖', async () => {
        const code = `
            define(['base/util', './global.js', '{platform}element.js'], function(_util, _global, _element, _p, _o, _f, _r) {
                var _p = {};
                
                return _p;
            })
        `;
        const {dependence, nejInject} = await getNejParseResult(code);

        expect(nejInject).toEqual([
            {alias: '_p', type: NejInjectType.object},
            {alias: '_o', type: NejInjectType.object},
            {alias: '_f', type: NejInjectType.function},
            {alias: '_r', type: NejInjectType.array}
        ]);

        expect(dependence).toEqual([
            {dep: 'base/util', alias: '_util'},
            {dep: './global.js', alias: '_global'},
            {dep: '{platform}element.js', alias: '_element'}
        ]);
    });

    it('支持 NEJ.define()', async () => {
        const code = `
            NEJ.define(['base/util', './global.js', '{platform}element.js'], function(_util, _global, _element, _p, _o, _f, _r) {
                var _p = {};
                
                return _p;
            })
        `;
        const {dependence, nejInject} = await getNejParseResult(code);

        expect(nejInject).toEqual([
            {alias: '_p', type: NejInjectType.object},
            {alias: '_o', type: NejInjectType.object},
            {alias: '_f', type: NejInjectType.function},
            {alias: '_r', type: NejInjectType.array}
        ]);

        expect(dependence).toEqual([
            {dep: 'base/util', alias: '_util'},
            {dep: './global.js', alias: '_global'},
            {dep: '{platform}element.js', alias: '_element'}
        ]);
    });
});
