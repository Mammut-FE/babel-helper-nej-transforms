import { NejInject, NejInjectType } from '..';
import { expectCodeEqual, generatorCode } from '../test.util';
import { generatorNejInjects } from './generator-nej-injects';


describe('generatorNejInjects', () => {
    it('generatorNejInjects is function', () => {
        expect(generatorNejInjects).toBeInstanceOf(Function);
    });

    it('验证变量注入', () => {
        const nejInjects: NejInject[] = [
            {alias: '_p', type: NejInjectType.object},
            {alias: '_o', type: NejInjectType.object},
            {alias: '_f', type: NejInjectType.function},
            {alias: '_r', type: NejInjectType.array}
        ];

        expectCodeEqual(generatorCode(generatorNejInjects(nejInjects)), `
            var _p = {};
            var _o = {};
            var _f = function () {};
            var _r = [];   
        `);
    });
});
