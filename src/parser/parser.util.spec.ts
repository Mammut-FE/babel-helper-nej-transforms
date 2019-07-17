import { Options } from '../options.interface';
import { analyzeDependence, normalize, splitModuleType } from './parser.util';

describe('parser.util test', () => {
    describe('splitModuleType', () => {
        it('splitModuleType is function', () => {
            expect(splitModuleType).toBeInstanceOf(Function);
        });

        it('javascript 依赖', () => {
            expect(splitModuleType('base/util')).toEqual([
                'javascript', 'base/util'
            ]);

        });

        it('regular 依赖', () => {
            expect(splitModuleType('regular!./tmp.html')).toEqual([
                'regular', './tmp.html'
            ]);

            expect(splitModuleType('REGULAR!./tmp.html')).toEqual([
                'regular', './tmp.html'
            ]);

            expect(splitModuleType('Regular!./tmp.html')).toEqual([
                'regular', './tmp.html'
            ]);
        });

        it('css/html 依赖', () => {
            expect(splitModuleType('text!./tmp.html')).toEqual([
                'text', './tmp.html'
            ]);

            expect(splitModuleType('TEXT!/tmp.html')).toEqual([
                'text', '/tmp.html'
            ]);

            expect(splitModuleType('Text!{pro}tmp.html')).toEqual([
                'text', '{pro}tmp.html'
            ]);
        });

        it('json 依赖', () => {
            expect(splitModuleType('json!./tmp.json')).toEqual([
                'json', './tmp.json'
            ]);

            expect(splitModuleType('JSON!/tmp.json')).toEqual([
                'json', '/tmp.json'
            ]);

            expect(splitModuleType('Json!{pro}tmp.json')).toEqual([
                'json', '{pro}tmp.json'
            ]);
        });
    });

    describe('normalize', () => {
        function _normalize(source: string) {
            return normalize(source, {
                alias: {
                    pro: 'src/javascript'
                },
                isNejCode: true
            });
        }

        it('nej 内部依赖', () => {
            expect(_normalize('base/util')).toEqual('base/util.js');
            expect(_normalize('{platform}element/element.js')).toEqual('platform/element/element.js');
        });

        it('绝对路径, 直接返回', () => {
            expect(_normalize('/base/util.js')).toEqual('/base/util.js');
        });

        it('相对路径, 直接返回', () => {
            expect(_normalize('./base/util.js')).toEqual('./base/util.js');
        });

        it('使用 {} 语法的 alias', () => {
            expect(_normalize('{pro}global/util.js')).toEqual('src/javascript/global/util.js');
        });

        it('没使用 {} 语法的 alias', () => {
            expect(_normalize('pro/global/util')).toEqual('src/javascript/global/util.js');
        });

        it('未匹配到 alias', () => {
            expect(_normalize('common/global/util')).toEqual('common/global/util.js');
            expect(_normalize('{common}global/util')).toEqual('common/global/util.js');
        });
    });

    describe('analyzeDependence', () => {
        const options: Options = {
            alias: {
                pro: 'src/javascript'
            },
            isNejCode: true
        };

        it('analyzeDependence is function', () => {
            expect(analyzeDependence).toBeInstanceOf(Function);
        });

        it('解析相对路径', () => {
            expect(analyzeDependence('./base/util.js', 'util', options)).toEqual({
                source: './base/util.js',
                name: 'util',
                rawSource: './base/util.js',
                moduleType: 'javascript'
            });

            expect(analyzeDependence('../base/util.js', 'util', options)).toEqual({
                source: '../base/util.js',
                name: 'util',
                rawSource: '../base/util.js',
                moduleType: 'javascript'
            });

            expect(analyzeDependence('regular!./template/tpl.html', 'tpl', options)).toEqual({
                source: './template/tpl.html',
                name: 'tpl',
                rawSource: 'regular!./template/tpl.html',
                moduleType: 'regular'
            });

            expect(analyzeDependence('text!./template/styles.css', 'styles', options)).toEqual({
                source: './template/styles.css',
                name: 'styles',
                rawSource: 'text!./template/styles.css',
                moduleType: 'text'
            });

            expect(analyzeDependence('json!../template/data.json', 'data', options)).toEqual({
                source: '../template/data.json',
                name: 'data',
                rawSource: 'json!../template/data.json',
                moduleType: 'json'
            });
        });

        it('解析绝对路径', () => {
            expect(analyzeDependence('/base/util.js', 'util', options)).toEqual({
                source: '/base/util.js',
                name: 'util',
                rawSource: '/base/util.js',
                moduleType: 'javascript'
            });

            expect(analyzeDependence('regular!/template/tpl.html', 'tpl', options)).toEqual({
                source: '/template/tpl.html',
                name: 'tpl',
                rawSource: 'regular!/template/tpl.html',
                moduleType: 'regular'
            });

            expect(analyzeDependence('text!/template/styles.css', 'styles', options)).toEqual({
                source: '/template/styles.css',
                name: 'styles',
                rawSource: 'text!/template/styles.css',
                moduleType: 'text'
            });

            expect(analyzeDependence('json!/template/data.json', 'data', options)).toEqual({
                source: '/template/data.json',
                name: 'data',
                rawSource: 'json!/template/data.json',
                moduleType: 'json'
            });
        });

        it('解析nej module', () => {
            expect(analyzeDependence('base/util', '_u', options)).toEqual({
                source: 'base/util.js',
                name: '_u',
                rawSource: 'base/util',
                moduleType: 'javascript'
            });

            expect(analyzeDependence('ui/form/form', '_f', options)).toEqual({
                source: 'ui/form/form.js',
                name: '_f',
                rawSource: 'ui/form/form',
                moduleType: 'javascript'
            });

            expect(analyzeDependence('platform/element/element', '_e', options)).toEqual({
                source: 'platform/element/element.js',
                name: '_e',
                rawSource: 'platform/element/element',
                moduleType: 'javascript'
            });

            expect(analyzeDependence('{base}util', '_u', options)).toEqual({
                source: 'base/util.js',
                name: '_u',
                rawSource: '{base}util',
                moduleType: 'javascript'
            });

            expect(analyzeDependence('{ui}form/form', '_f', options)).toEqual({
                source: 'ui/form/form.js',
                name: '_f',
                rawSource: '{ui}form/form',
                moduleType: 'javascript'
            });

            expect(analyzeDependence('{platform}element/element', '_e', options)).toEqual({
                source: 'platform/element/element.js',
                name: '_e',
                rawSource: '{platform}element/element',
                moduleType: 'javascript'
            });

            expect(analyzeDependence('pro/platform/element/element', '_e', options)).toEqual({
                source: 'src/javascript/platform/element/element.js',
                name: '_e',
                rawSource: 'pro/platform/element/element',
                moduleType: 'javascript'
            });

            expect(analyzeDependence('{pro}platform/element/element', '_e', options)).toEqual({
                source: 'src/javascript/platform/element/element.js',
                name: '_e',
                rawSource: '{pro}platform/element/element',
                moduleType: 'javascript'
            });
        });
    });
});
