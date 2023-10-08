export default class Download {
    private static width;
    private static height;
    private static x;
    private static y;
    private static r;
    private static img;
    private static offset;
    constructor(width: number, height: number, offset: any);
    draw(ctx: any): this;
    inArea(x: number, y: number): boolean;
}
