import { Statement } from '@babel/types';
import { DependenceInfo } from './dependence-info.interface';
import { NejInject } from './nej-inject.interface';

export interface NejMeta {
    fnBody: Statement[];
    dependence: DependenceInfo[];
    nejInject: NejInject[];
}
