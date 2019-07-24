import * as types from '@babel/types';
import {Statement} from '@babel/types';
import {Dependence} from '../parser/interfaces/dependence.interface';


export function generatorNejDependencies(dependencies: Dependence[]): Statement[] {
    return dependencies.map(({source, name}) => {
        return types.importDeclaration([types.importDefaultSpecifier(types.identifier(name))], types.stringLiteral(source));
    });
}
