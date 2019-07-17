import { generatorNejDependencies, generatorNejInjects } from './generators';
import { Options } from './options.interface';
import { NejInjectType } from './parser/enums/nej-inject-type.enum';
import { Dependence } from './parser/interfaces/dependence.interface';
import { NejInject } from './parser/interfaces/nej-inject.interface';
import { NejMeta } from './parser/interfaces/nej-meta.interface';
import { nejCodeParser } from './parser/nej-code-parser';
import { transformReturnToExport, transformThis2Window } from './transforms';


export {
    Dependence,
    generatorNejDependencies,
    generatorNejInjects,
    nejCodeParser,
    NejInject,
    NejInjectType,
    NejMeta,
    Options,
    transformReturnToExport,
    transformThis2Window
};
