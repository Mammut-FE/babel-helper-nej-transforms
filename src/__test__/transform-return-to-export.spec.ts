import * as types from '@babel/types';
import { ExportDefaultDeclaration, Identifier } from '@babel/types';
import { transformReturnToExport } from '../transform-return-to-export';
import { getNejParseResult } from './nej-module-parser.spec';

describe('transformReturnToExport', () => {
    it('transformReturnToExport is Function', () => {
        expect(transformReturnToExport).toBeInstanceOf(Function);
    });

    it('存在 return 语句时, 将其 export', async () => {
        const code = `
        define([], function() {
            var a = '1';
            return a;
        })
        `;
        let {fnBody, nejInject} = await getNejParseResult(code);
        fnBody = transformReturnToExport(fnBody, nejInject);
        let lastStatement = fnBody[fnBody.length - 1];

        expect(types.isExportDefaultDeclaration(lastStatement));
        expect(types.isIdentifier((lastStatement as ExportDefaultDeclaration).declaration));
        expect(((lastStatement as ExportDefaultDeclaration).declaration as Identifier).name).toEqual('a');
    });

    it('不存在 return 语句时, 导出nej注入的命名空间 _p', async () => {
        const code = `
        define([], function(_p, _o, _f, _r) {
            var a = '1';
        })
        `;
        let {fnBody, nejInject} = await getNejParseResult(code);
        fnBody = transformReturnToExport(fnBody, nejInject);
        let lastStatement = fnBody[fnBody.length - 1];

        expect(types.isExportDefaultDeclaration(lastStatement));
        expect(types.isIdentifier((lastStatement as ExportDefaultDeclaration).declaration));
        expect(((lastStatement as ExportDefaultDeclaration).declaration as Identifier).name).toEqual('_p');
    });
});
