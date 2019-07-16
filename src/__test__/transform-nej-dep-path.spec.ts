import { transformNejDepPath } from '../transform-nej-dep-path';

describe('resolveNejPath', () => {
    it('transformNEJDep is Function', () => {
        expect(transformNejDepPath).toBeInstanceOf(Function);
    });

    describe('处理绝对路径', () => {
        it('同一目录下', () => {
            expect(transformNejDepPath('base/util', './base/element.js')).toEqual('./util');
        });

        it('子目录', () => {
            expect(transformNejDepPath('base/util', './base/platform/element.js')).toEqual('../util');
            expect(transformNejDepPath('base/platform', './base/platform/platform.js')).toEqual('../platform');
        });


        it('上级目录中的其他目录', () => {
            expect(transformNejDepPath('base/util', './util/util.js')).toEqual('../base/util');
        });

        it('上级目录中的其他目录的子目录', () => {
            expect(transformNejDepPath('base/util', './util/xhr/xhr.js')).toEqual('../../base/util');
        });
    });

    describe('处理相对路径', () => {
        it('同一目录下', () => {
            expect(transformNejDepPath('./base/util.js', './base/element.js')).toEqual('./base/util');
        });

        it('子目录', () => {
            expect(transformNejDepPath('./base/util.js', './base/platform/element.js')).toEqual('./base/util');
            expect(transformNejDepPath('./base/platform.js', './base/platform/platform.js')).toEqual('./base/platform');

            expect(transformNejDepPath('../proxy/xhr.js', './util/ajax/platform/xhr.js')).toEqual('../proxy/xhr');
        });


        it('上级目录中的其他目录', () => {
            expect(transformNejDepPath('./base/util.js', './util/util.js')).toEqual('./base/util');
        });

        it('上级目录中的其他目录的子目录', () => {
            expect(transformNejDepPath('./base/util.js', './util/xhr/xhr.js')).toEqual('./base/util');
        });
    });

    describe('处理 platform', () => {
        it('同一目录下', () => {
            expect(transformNejDepPath('{platform}util.js', './base/element.js')).toEqual('./platform/util');
        });

        it('子目录', () => {
            expect(transformNejDepPath('{platform}util.js', './base/platform/element.js')).toEqual('./platform/util');
            expect(transformNejDepPath('{platform}platform.js', './base/platform/platform.js')).toEqual('./platform/platform');
        });


        it('上级目录中的其他目录', () => {
            expect(transformNejDepPath('{platform}util.js', './util/util.js')).toEqual('./platform/util');
        });

        it('上级目录中的其他目录的子目录', () => {
            expect(transformNejDepPath('{platform}util.js', './util/xhr/xhr.js')).toEqual('./platform/util');
        });
    });
});
