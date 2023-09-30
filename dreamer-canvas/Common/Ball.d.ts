export default class Ball {
    x: number;
    y: number;
    r: number;
    width: number;
    height: number;
    fillStyle: string;
    constructor(props: any);
    draw(ctx: any): this;
    inBlock(x: number, y: number): boolean;
}
