/**
 * 对采用 nej 规范编写的 js 文件进行解析
 * 返回文件中的 依赖信息、nej注入和函数主体
 */
import { NodePath, Visitor } from '@babel/traverse';
import * as types from '@babel/types';
import {
    ArrayExpression,
    CallExpression,
    FunctionExpression,
    Identifier,
    Statement,
    StringLiteral
} from '@babel/types';

import { Options } from '../options.interface';
import { NejInjectType } from './enums/nej-inject-type.enum';
import { Dependence } from './interfaces/dependence.interface';
import { NejInject } from './interfaces/nej-inject.interface';
import { NejMeta } from './interfaces/nej-meta.interface';
import { analyzeDependence, checkIsDefineFunction } from './parser.util';

export function nejCodeParser(path: NodePath, options: Options): NejMeta {
    let fnBody: Statement[];
    let dependencies: Dependence[] = [];
    let nejInject: NejInject[] = [];

    const nejInjectType = [
        NejInjectType.object,
        NejInjectType.object,
        NejInjectType.function,
        NejInjectType.array
    ];

    const visitor: Visitor = {
        CallExpression: (path: NodePath<CallExpression>) => {
            const {node} = path;

            if (checkIsDefineFunction(path)) {
                let [depArguments, funExpression] = node.arguments as [ArrayExpression, FunctionExpression];

                if (types.isFunctionExpression(depArguments)) {
                    funExpression = depArguments;
                    depArguments = types.arrayExpression([]);
                }

                const deps: string[] = depArguments.elements.map((argument: StringLiteral) => argument.value);
                const depLength = deps.length;

                // 解析依赖和 nej 注入变量
                funExpression.params.forEach((param: Identifier, index) => {
                    if (index < depLength) {
                        dependencies.push(analyzeDependence(deps[index], param.name, options));
                    } else {
                        nejInject.push({
                            type: nejInjectType[index - depLength],
                            alias: param.name
                        });
                    }
                });

                // 解析只导入未引用的依赖
                deps.slice(funExpression.params.length).forEach(dep => {
                    dependencies.push(analyzeDependence(dep, undefined, options));
                });

                // 解析函数主体
                fnBody = funExpression.body.body;
            }
        }
    };

    path.traverse(visitor);

    return {
        fnBody,
        dependencies,
        nejInject
    };
}
