import { NodePath } from '@babel/traverse';
import * as types from '@babel/types';
import { CallExpression } from '@babel/types';
import { extname } from 'path';
import { Options } from '../options.interface';
import { Dependence } from './interfaces/dependence.interface';
import { NejModuleType } from './interfaces/nej-module-type.interface';

/**
 * 检测是否是 NEJ.define 函数
 * @param {NodePath<CallExpression>} path
 * @return {boolean}
 */
export function checkIsDefineFunction(path: NodePath<CallExpression>) {
    const {node} = path;

    return types.isIdentifier(node.callee) && node.callee.name === 'define'
        || (
            types.isMemberExpression(node.callee)
            && (types.isIdentifier(node.callee.object) && node.callee.object.name === 'NEJ')
            && (types.isIdentifier(node.callee.property) && node.callee.property.name === 'define')
        );
}

/**
 * 分离依赖中的类型和路径
 *
 * @param {string} source
 */
export function splitModuleType(source: string): [NejModuleType, string] {
    let type: NejModuleType = 'javascript';
    let rawSource = source;

    const textModuleReg = /^\b(json|text|regular)!/i;
    const result = textModuleReg.exec(source);

    if (result) {
        const [_] = result;

        type = _.substring(0, _.length - 1).toLowerCase();
        rawSource = source.substring(_.length);
    }

    return [type, rawSource];
}

/**
 * 标准化路径, 去掉其中的 alias 和 "{}"
 *
 * @param {string} source
 * @param options
 */
export function normalize(source: string, options: Options): string {
    const {alias, isNejCode} = options;

    // 转换 nej 中的 {} 语法
    source = source.replace(/^{(.*?)}(.*?)/, '$1/$2');

    // 转换 alias
    source = source.replace(/^\b(.*?)\//, (match, p1) => {
        if (alias[p1]) {
            return alias[p1] + '/';
        }

        if (!isNejCode) {
            console.warn(`alias ${p1} not match`);
        }

        return `${p1}/`;
    });

    // 未设置文件类型的添加 .js
    if (!extname(source)) {
        source += '.js';
    }

    return source;
}

/**
 * 分析依赖信息
 *
 * @param {string} rawSource
 * @param {string} name
 * @param options
 * @return {Dependence}
 */
export function analyzeDependence(rawSource: string, name: string, options: Options): Dependence {
    let [moduleType, source] = splitModuleType(rawSource);

    source = normalize(source, options);

    return {
        source,
        name,
        rawSource,
        moduleType
    };
}
