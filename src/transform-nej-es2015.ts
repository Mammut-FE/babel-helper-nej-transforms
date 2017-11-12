import * as types from 'babel-types';
import { source2name as nejmMap } from 'nejm/nejmap';

import { TEXT_DEPS, genAliasRe } from './util';

// types
import { NodePath, Node } from 'babel-traverse';


export interface Dependence {
    source: string;
    name?: string;
    isNej: boolean;
    isText: boolean;
    nejmName?: string;
}

export interface NEJDependence {
    custormModule: Dependence[];
    textModule: Dependence[];
    nejModule: Dependence[];
    rawDeps: Dependence[];
    fnBody: Node[];
}

export interface Options {
    /**
     * 移除文本文件前面的标志(text! regular! json!)
     * 
     * @default true
     */
    replaceTextModule?: boolean;
    /**
     * 为了能够将源码存放在现有的项目文件夹, 同时又需要使用 .js 后缀而做的妥协
     * @example
     * extName: '.es6'
     * inFileName: store.js
     * outFileName: store.es6.js
     */
    extName?: string;
    /**
     * 处理nej的依赖管理, 转换成 es6 的模块管理
     * 详细信息: https://medium.com/@davidjwoody/how-to-use-absolute-paths-in-react-native-6b06ae3f65d1
     * 
     * 转换成如下的方式进行模块的导入
     * import Thing from ‘AwesomeApp/app/some/thing’
     * create 'AwesomeApp/app/package.json' ==> { “name”: “app” } (注意name的值需要和文件夹的名称相同)
     * import Thing from ‘app/some/thing’
     * 
     * @example
     * alias = {
     *     '{pro}lib': 'lib',
     *     '{common}': 'common/'
     * }
     * 
     * {pro}lib/redux/redux.js ==> lib/redux/redux
     * /pro/lib/redux/redux    ==> lib/redux/redux
     * {common}tree/tree.js    ==> common/tree/tree
     * /common/tree/tree.js    ==> common/tree/tree
     */
    alias?: { [key: string]: string }
}

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
    const isText = TEXT_DEPS.test(source);

    return {
        source,
        isNej,
        isText,
        nejmName
    }
};

const defaultOptions: Options = {
    replaceTextModule: true,
    extName: '',
    alias: {}
}
/**
 * 获取nej模块依赖
 *
 * @param path
 */
export default function (path: NodePath, options: Options = {}): NEJDependence {
    options = Object.assign(defaultOptions, options);

    let fnBody;
    const deps: Dependence[] = [];

    const custormModule: Dependence[] = [];
    const textModule: Dependence[] = [];
    const nejModule: Dependence[] = [];

    const aliasRe = genAliasRe(options.alias);

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
            if (options.replaceTextModule) { // 判断是否需要清除文本标志
                dep.source = dep.source.replace(TEXT_DEPS, '');
            }

            textModule.push(dep);
        } else {
            const result = dep.source.match(aliasRe); // 处理nej alias

            if (result) {
                dep.source = dep.source.replace(result[0], options.alias[result[0]]);
            }

            // 处理尾缀
            dep.source = dep.source.replace(/\.js/, options.extName);

            custormModule.push(dep);
        }
    });

    return {
        custormModule,
        textModule,
        nejModule,
        rawDeps: deps,
        fnBody
    }
}
