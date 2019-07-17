import { Dependence } from '..';
import { expectCodeEqual, generatorCode } from '../test.util';
import { generatorNejDependencies } from './generator-nej-dependencies';


describe('generatorNejInjects', () => {
    it('generatorNejInjects is function', () => {
        expect(generatorNejDependencies).toBeInstanceOf(Function);
    });

    it('依赖转换正确', () => {
        const dependencies: Dependence[] = [
            {rawSource: '', source: './base/util', moduleType: 'javascript', name: 'util'},
            {rawSource: '', source: './styles/style.css', moduleType: 'text', name: 'style'},
            {rawSource: '', source: './template/template.html', moduleType: 'text', name: 'template'},
            {rawSource: '', source: './template/template1.html', moduleType: 'regular', name: 'template1'},
            {rawSource: '', source: './data/result.json', moduleType: 'json', name: 'result'}
        ];

        expectCodeEqual(generatorCode(generatorNejDependencies(dependencies)), `
            import util from "./base/util";
            import * as style from "./styles/style.css";
            import * as template from "./template/template.html";
            import * as template1 from "./template/template1.html";
            import * as result from "./data/result.json";
        `);
    });
});
