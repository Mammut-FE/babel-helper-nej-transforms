import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { ReturnStatement, VariableDeclaration } from '@babel/types';
import { Options } from '../options.interface';
import { NejInjectType } from './enums/nej-inject-type.enum';
import { NejMeta } from './interfaces/nej-meta.interface';
import { nejCodeParser } from './nej-code-parser';

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

describe('nejParser', () => {
    it('nejParser is function', () => {
        expect(nejCodeParser).toBeInstanceOf(Function);
    });

    it('解析非 js 文件时, 返回 {fnBody: undefined, dependence: [], nejInject: []}', async () => {
        await expect(getNejParseResult(`111111`)).resolves.toEqual({
            fnBody: undefined,
            dependencies: [],
            nejInject: []
        });
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
        const {dependencies, nejInject} = await getNejParseResult(code);

        expect(nejInject).toEqual([
            {alias: '_p', type: NejInjectType.object},
            {alias: '_o', type: NejInjectType.object},
            {alias: '_f', type: NejInjectType.function},
            {alias: '_r', type: NejInjectType.array}
        ]);

        expect(dependencies).toEqual([
            {
                'moduleType': 'javascript',
                'name': '_util',
                'rawSource': 'base/util',
                'source': 'base/util.js'
            },
            {
                'moduleType': 'javascript',
                'name': '_global',
                'rawSource': './global.js',
                'source': './global.js'
            },
            {
                'moduleType': 'javascript',
                'name': '_element',
                'rawSource': '{platform}element.js',
                'source': 'platform/element.js'
            }
        ]);
    });

    it('支持 NEJ.define()', async () => {
        const code = `
            NEJ.define(['base/util', './global.js', '{platform}element.js'], function(_util, _global, _element, _p, _o, _f, _r) {
                var _p = {};
                
                return _p;
            })
        `;
        const {dependencies, nejInject} = await getNejParseResult(code);

        expect(nejInject).toEqual([
            {alias: '_p', type: NejInjectType.object},
            {alias: '_o', type: NejInjectType.object},
            {alias: '_f', type: NejInjectType.function},
            {alias: '_r', type: NejInjectType.array}
        ]);

        expect(dependencies).toEqual([
            {
                'moduleType': 'javascript',
                'name': '_util',
                'rawSource': 'base/util',
                'source': 'base/util.js'
            },
            {
                'moduleType': 'javascript',
                'name': '_global',
                'rawSource': './global.js',
                'source': './global.js'
            },
            {
                'moduleType': 'javascript',
                'name': '_element',
                'rawSource': '{platform}element.js',
                'source': 'platform/element.js'
            }
        ]);
    });

    it('支持非 js 文件的解析', async () => {
        const code = `
            define(['text!./template.html', 'text!./style.css', 'regular!./tpl.html', 'json!./tpl.json'], function(t1, style, t2, data) {
                var _p = {};
                
                return _p;
            })
        `;
        const {dependencies} = await getNejParseResult(code);

        expect(dependencies).toEqual([
            {
                'moduleType': 'text',
                'name': 't1',
                'rawSource': 'text!./template.html',
                'source': './template.html'
            },
            {
                'moduleType': 'text',
                'name': 'style',
                'rawSource': 'text!./style.css',
                'source': './style.css'
            },
            {
                'moduleType': 'regular',
                'name': 't2',
                'rawSource': 'regular!./tpl.html',
                'source': './tpl.html'
            },
            {
                'moduleType': 'json',
                'name': 'data',
                'rawSource': 'json!./tpl.json',
                'source': './tpl.json'
            }
        ]);
    });
});
