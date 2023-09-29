import {
    runtimeDecorator,
} from "./utils"
export default class Ball{
    x:number;
    y:number;
    r:number;
    width: number;
    height: number;
    fillStyle: string;

    constructor(props:any){
        this.x  = 0
        this.y = 0;
        this.r = 30;
        this.width = 0;
        this.height = 0;
        this.fillStyle = "red"
        Object.assign( this, props )
        return this;
    }

    draw(ctx:any){
        ctx.save()
        ctx.fillStyle = this.fillStyle;
        ctx.translate( this.x, this.y )
        ctx.beginPath()
        ctx.arc( 0, 0, this.r, 0, Math.PI * 2 )
        ctx.closePath()
        ctx.fill()
        ctx.restore()
        return this;
    }

    @runtimeDecorator()
    inBlock(x: number, y:number){
        return Math.sqrt( (x - this.x) ** 2 + (y - this.y) ** 2 ) < this.r; 
    }

}