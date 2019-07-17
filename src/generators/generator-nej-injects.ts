import * as types from '@babel/types';
import { Statement } from '@babel/types';
import { NejInjectType } from '../parser/enums/nej-inject-type.enum';
import { NejInject } from '../parser/interfaces/nej-inject.interface';


export function generatorNejInjects(nejInjects: NejInject[]): Statement[] {
    return nejInjects.map(({type, alias}) => {
        let statement: Statement;
        switch (type) {
            case NejInjectType.array:
                statement = types.variableDeclaration('var', [
                    types.variableDeclarator(types.identifier(alias), types.arrayExpression())
                ]);
                break;
            case NejInjectType.function:
                statement = types.variableDeclaration('var', [
                    types.variableDeclarator(types.identifier(alias), types.functionExpression(null, [], types.blockStatement([])))
                ]);
                break;
            case NejInjectType.object:
                statement = types.variableDeclaration('var', [
                    types.variableDeclarator(types.identifier(alias), types.objectExpression([]))
                ]);
                break;
            default:
                statement = types.variableDeclaration('var', [
                    types.variableDeclarator(types.identifier(alias))
                ]);
        }

        return statement;
    });
}
