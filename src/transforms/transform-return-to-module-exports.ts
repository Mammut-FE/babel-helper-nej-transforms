import * as types from '@babel/types';
import { ReturnStatement, Statement } from '@babel/types';
import { NejInject } from '../parser/interfaces/nej-inject.interface';


function createModuleExports(expression) {
    return types.assignmentExpression('=', types.memberExpression(types.identifier('module'), types.identifier('exports')), expression);
}

export function transformReturnToModuleExports(fnBody: Statement[], nejInject: NejInject[]) {
    let lastStatement = fnBody[fnBody.length - 1];
    if (types.isReturnStatement(lastStatement)) {
        fnBody[fnBody.length - 1] = types.expressionStatement(
            createModuleExports((lastStatement as ReturnStatement).argument)
        );
    } else if (nejInject.length) { // 没有导出时, 并且通过nej注入了 _p, 则默认抛出 _p
        // @ts-ignore
        fnBody.push(createModuleExports(types.identifier(nejInject[0].alias)));
    }

    return fnBody;
}
