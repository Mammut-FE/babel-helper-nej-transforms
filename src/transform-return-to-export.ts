import * as types from '@babel/types';
import { ReturnStatement, Statement } from '@babel/types';
import { NejInject } from './interfaces/nej-inject.interface';


export function transformReturnToExport(fnBody: Statement[], nejInject: NejInject[]) {
    let lastStatement = fnBody[fnBody.length - 1];
    if (types.isReturnStatement(lastStatement)) {
        fnBody[fnBody.length - 1] = types.exportDefaultDeclaration((lastStatement as ReturnStatement).argument);
    } else if (nejInject.length) { // 没有导出时, 并且通过nej注入了 _p, 则默认抛出 _p
        fnBody.push(types.exportDefaultDeclaration(types.identifier(nejInject[0].alias)));
    }

    return fnBody;
}
