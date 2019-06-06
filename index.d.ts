declare namespace argc {
    export type predicate = (arg: any) => boolean;
}

declare function argc(arg: any, ...predicates: (argc.predicate | argc.predicate[])[]): void;

export = argc;
export as namespace argc;
