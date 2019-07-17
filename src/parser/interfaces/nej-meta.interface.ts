import { Statement } from '@babel/types';
import { Dependence } from './dependence.interface';
import { NejInject } from './nej-inject.interface';

export interface NejMeta {
    fnBody: Statement[];
    nejInject: NejInject[];
    dependencies: Dependence[];
}
