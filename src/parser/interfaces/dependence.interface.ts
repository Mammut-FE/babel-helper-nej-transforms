import { NejModuleType } from './nej-module-type.interface';

export interface Dependence {
    rawSource: string;

    source: string;

    name?: string;

    moduleType: NejModuleType;
}
