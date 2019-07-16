export enum NejInjectType {
    'object',
    'function',
    'array'
}

export interface NejInject {
    alias: string;
    type: NejInjectType
}
