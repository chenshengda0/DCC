export default class ScaleUp {
    private static x;
    private static y;
    private static width;
    private static height;
    private static offset;
    private static img;
    private static r;
    constructor(width: number, height: number, offset: number);
    draw(ctx: any): this;
    inArea(x: number, y: number): boolean;
}
