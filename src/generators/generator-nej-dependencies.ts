import * as types from '@babel/types';
import { Statement } from '@babel/types';
import { Dependence } from '../parser/interfaces/dependence.interface';


export function generatorNejDependencies(dependencies: Dependence[]): Statement[] {
    return dependencies.map(({source, name, moduleType}) => {
        let specifiers;
        if (moduleType === 'javascript') {
            specifiers = [types.importDefaultSpecifier(types.identifier(name))];
        } else {
            specifiers = [types.importNamespaceSpecifier(types.identifier(name))];
        }

        return types.importDeclaration(specifiers, types.stringLiteral(source));
    });
}
