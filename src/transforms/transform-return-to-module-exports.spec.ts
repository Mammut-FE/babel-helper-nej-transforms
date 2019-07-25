import { expectCodeEqual, generatorCode, getNejParseResult } from '../test.util';
import { transformReturnToModuleExports } from './transform-return-to-module-exports';

describe('transformReturnToModuleExports', () => {
    it('transformReturnToModuleExports is Function', () => {
        expect(transformReturnToModuleExports).toBeInstanceOf(Function);
    });

    it('存在 return 语句时, 将其 export', async () => {
        const code = `
        define([], function() {
            var a = '1';
            return a;
        })
        `;
        let {fnBody, nejInject} = await getNejParseResult(code);
        fnBody = transformReturnToModuleExports(fnBody, nejInject);

        expectCodeEqual(generatorCode(fnBody), `
            var a = '1';
            module.exports = a;
        `);
    });

    it('不存在 return 语句时, 导出nej注入的命名空间 _p', async () => {
        const code = `
        define([], function(_p, _o, _f, _r) {
            var a = '1';
        })
        `;
        let {fnBody, nejInject} = await getNejParseResult(code);
        fnBody = transformReturnToModuleExports(fnBody, nejInject);

        expectCodeEqual(generatorCode(fnBody), `
            var a = '1';
            module.exports = _p;
        `);
    });
});
