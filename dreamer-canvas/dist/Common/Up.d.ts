export default class Up {
    private static iWidth;
    private static iHeight;
    private static tcanvas;
    width: number;
    height: number;
    matrix: number[][];
    offset: any;
    constructor(props: any);
    draw(ctx: any): this;
    inArea(x: number, y: number): boolean;
}
