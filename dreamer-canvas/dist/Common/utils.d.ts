export declare const sleep: (wait?: number) => Promise<unknown>;
export declare const runtimeDecorator: () => MethodDecorator;
export declare const getRandom: (arr: number[], isInt?: boolean) => number;
export declare const getAxis: (left: number[][], right?: number[][], isPoint?: boolean) => number[][];
export declare const matrix3D: (source: number[][]) => number[];
export declare const matrix2D: (source: number[][]) => number[];
export declare const getAve: (source: number[]) => {
    source: number[];
    count: number;
    sum: number;
    ave: number;
};
export declare const getGray: (rgba: number[]) => number;
export declare const invertNO: (source: number[][]) => number[][];
export declare const impact: (b0: any, b1: any) => void;
export declare const determinant: (source: number[][]) => number;
export declare const adjoint: (param: number[][], tag?: boolean) => number[][];
export declare const invert: (param: number[][], tag?: boolean) => number[][];
export declare function perspectiveNO(fovy: number, aspect: number, near: number, far: number): number[][];
