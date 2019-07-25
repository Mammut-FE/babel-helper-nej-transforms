import * as types from '@babel/types';
import {Dependence} from '../parser/interfaces/dependence.interface';


export function generatorNejDependenciesAsCommonjs(dependencies: Dependence[]): any[] {
    return dependencies.map(({source, name}) => {
        const requireIdentifier = types.identifier('require');

        if (name) {
            return types.variableDeclaration('const', [
                types.variableDeclarator(
                    types.identifier(name),
                    types.callExpression(requireIdentifier, [types.stringLiteral(source)])
                )
            ]);
        }

        return types.callExpression(requireIdentifier, [types.stringLiteral(source)]);
    });
}
