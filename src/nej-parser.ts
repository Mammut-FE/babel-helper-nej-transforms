/**
 * nej module 文件解析
 * 返回文件中的 依赖信息、nej注入和函数主体
 * @author lleohao<lleohao@hotmail.com>
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
import { DependenceInfo } from './interfaces/dependence-info.interface';
import { NejInject, NejInjectType } from './interfaces/nej-inject.interface';
import { NejMeta } from './interfaces/nej-meta.interface';

export function nejParser(path: NodePath): NejMeta {
    let fnBody: Statement[];
    let dependence: DependenceInfo[] = [];
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

            if (types.isIdentifier(node.callee) && node.callee.name === 'define'
                || (
                    types.isMemberExpression(node.callee)
                    && (types.isIdentifier(node.callee.object) && node.callee.object.name === 'NEJ')
                    && (types.isIdentifier(node.callee.property) && node.callee.property.name === 'define')
                )
            ) {
                let [depArguments, funExpression] = node.arguments as [ArrayExpression, FunctionExpression];

                if (types.isFunctionExpression(depArguments)) {
                    funExpression = depArguments;
                    depArguments = types.arrayExpression([]);
                }

                const deps: string[] = depArguments.elements.map((argument: StringLiteral) => argument.value);
                const depLength = deps.length;

                fnBody = funExpression.body.body;
                funExpression.params.map((param: Identifier, index) => {
                    if (index < depLength) {
                        dependence.push({
                            dep: deps[index],
                            alias: param.name
                        });
                    } else {
                        nejInject.push({
                            type: nejInjectType[index - depLength],
                            alias: param.name
                        });
                    }
                });
            }
        }
    };

    path.traverse(visitor);

    return {
        fnBody,
        dependence,
        nejInject
    };
}
