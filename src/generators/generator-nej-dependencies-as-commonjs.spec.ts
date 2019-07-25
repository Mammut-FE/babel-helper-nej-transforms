import { Dependence } from '..';
import { expectCodeEqual, generatorCode } from '../test.util';
import { generatorNejDependenciesAsCommonjs } from './generator-nej-dependencies-as-commonjs';


describe('generatorNejInjects', () => {
    it('generatorNejInjects is function', () => {
        expect(generatorNejDependenciesAsCommonjs).toBeInstanceOf(Function);
    });

    it('依赖转换正确', () => {
        const dependencies: Dependence[] = [
            {rawSource: '', source: './base/util', moduleType: 'javascript', name: 'util'},
            {rawSource: '', source: './styles/style.css', moduleType: 'text', name: 'style'},
            {rawSource: '', source: './template/template.html', moduleType: 'text', name: 'template'},
            {rawSource: '', source: './template/template1.html', moduleType: 'regular', name: 'template1'},
            {rawSource: '', source: './data/result.json', moduleType: 'json', name: 'result'},
            {rawSource: '', source: './global/polyfill', moduleType: 'javascript'},
            {rawSource: '', source: './styles/style.css', moduleType: 'text'},
            {rawSource: '', source: './template/template.html', moduleType: 'text'},
            {rawSource: '', source: './template/template1.html', moduleType: 'regular'},
            {rawSource: '', source: './data/result.json', moduleType: 'json'}
        ];

        expectCodeEqual(generatorCode(generatorNejDependenciesAsCommonjs(dependencies)), `
            const util = require("./base/util");
            const style = require("./styles/style.css");
            const template = require("./template/template.html");
            const template1 = require("./template/template1.html");
            const result = require("./data/result.json");
            require("./global/polyfill")
            require("./styles/style.css")
            require("./template/template.html")
            require("./template/template1.html")
            require("./data/result.json")
        `);
    });
});
