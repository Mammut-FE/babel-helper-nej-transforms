import * as types from 'babel-types';
import { NodePath } from 'babel-traverse';
import { source2name as nejmMap } from 'nejm/nejmap';

export interface Dependence {
    source: string;
    name?: string;
    isNej: boolean;
    isText: boolean;
    moduleName?: string;
    nejmName?: string;
}

export interface NEJDependence {
    custormModule: Dependence[];
    textModule: Dependence[];
    nejModule: Dependence[];
    rawDeps: Dependence[];
    fnBody: any;
}

const textDeps = /^text!|^regular!|^json!/i;

/**
 * 分析nej模块的依赖
 *
 * @param source 依赖路径
 *
 * NEJ 依赖举例
 * 1. base/util                 导入 nej 模块
 * 2. pro/extend/util
 *    {pro}/extend/util.js      导入 pro 文件夹下的模块
 * 3. text!/path/to/file.css    导入文本文件
 * 4.
 */
const analyisDeps = (source: string): Dependence => {
    const nejmName = nejmMap[source];
    const isNej = nejmName !== undefined;
    const isText = textDeps.test(source);

    const moduleNameRe = /^{(.*?)}/;
    let moduleName = '';

    if (!(isNej || isText) && (source.startsWith('{') || !source.endsWith('.js'))) { // 导入nej路径配置的文件
        const result = source.match(moduleNameRe);
        if (result) {
            moduleName = result[1];
        } else {
            moduleName = source.split('/')[0];
        }
    }

    return {
        source,
        isNej,
        isText,
        moduleName,
        nejmName
    }
};

/**
 * 获取nej模块依赖
 *
 * @param path
 */
export default function (path: NodePath): NEJDependence {
    let fnBody;
    const deps: Dependence[] = [];

    const custormModule: Dependence[] = [];
    const textModule: Dependence[] = [];
    const nejModule: Dependence[] = [];

    const visitor = {
        CallExpression: ({ node }) => {
            if (node.callee.name === 'define') {
                node.arguments[0].elements.forEach(({ value }) => {
                    deps.push(analyisDeps(value));
                });

                if (types.isFunctionExpression(node.arguments[1])) {
                    fnBody = node.arguments[1].body.body;

                    node.arguments[1].params.forEach((param, i) => {
                        deps[i]['name'] = param.name;
                    });
                }
            }
        }
    };
    path.traverse(visitor);

    deps.forEach(dep => {
        if (dep.isNej) {
            nejModule.push(dep);
        } else if (dep.isText) {
            textModule.push(dep);
        } else {
            custormModule.push(dep);
        }
    })


    return {
        custormModule,
        textModule,
        nejModule,
        rawDeps: deps,
        fnBody
    }
}
