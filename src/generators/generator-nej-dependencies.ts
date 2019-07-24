import * as types from '@babel/types';
import { Statement } from '@babel/types';
import { Dependence } from '../parser/interfaces/dependence.interface';


export function generatorNejDependencies(dependencies: Dependence[]): Statement[] {
    return dependencies.map(({source, name}) => {
        let specifiers = [];

        if (name) {
            specifiers.push(types.importDefaultSpecifier(types.identifier(name)));
        }

        return types.importDeclaration(specifiers, types.stringLiteral(source));
    });
}
