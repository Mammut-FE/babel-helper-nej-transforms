import * as t from '@babel/types';
import { identifier, MemberExpression, Statement, variableDeclaration, variableDeclarator } from '@babel/types';

export function transformThis2Window(fnBody: Statement[]) {
    let result: Statement[] = [
        // 插入 globalThis 变量指向 window
        variableDeclaration('var', [variableDeclarator(identifier('globalThis'), identifier('window'))])
    ];

    fnBody.forEach(statement => {
        // 转换 this 指向
        if (t.isVariableDeclaration(statement)) {
            statement.declarations.forEach(declaration => {
                if (t.isThisExpression(declaration.init)) {
                    declaration.init = identifier('globalThis');
                }
                else if (t.isMemberExpression(declaration.init)
                    && t.isMemberExpression((declaration.init as MemberExpression).object)
                    && t.isThisExpression((declaration.init.object as MemberExpression).object)
                ) {
                    (declaration.init.object as MemberExpression).object = identifier('globalThis');
                }
            });
        }

        result.push(statement);
    });

    return result;
}
