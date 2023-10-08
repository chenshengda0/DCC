import scaleUpIcon from "./static/scaleup.png"

export default class ScaleUp{

    private static x:number = 30;
    private static y:number = 0;
    private static width:number;
    private static height:number;
    private static offset:any;
    private static img:any;
    private static r:number = 15;

    constructor(width:number, height:number, offset:number){
        ScaleUp.img = new Image();
        ScaleUp.width = width;
        ScaleUp.height = height;
        ScaleUp.offset = offset;
        ScaleUp.img.src = scaleUpIcon;
    }

    draw(ctx:any){
        ctx.save();
        ctx.translate( ScaleUp.x, ScaleUp.y )
        ctx.beginPath()
        ctx.rect( 0, 0, ScaleUp.r << 1, ScaleUp.r << 1 )
        ctx.closePath()
        ctx.clip()
        ctx.drawImage( ScaleUp.img, 0, 0, ScaleUp.img.width, ScaleUp.img.height, 0, 0, ScaleUp.r << 1, ScaleUp.r << 1 )
        ctx.restore();
        return this;
    }

    inArea(x:number, y:number){
        const currentX = x - ScaleUp.offset.left;
        const currentY = y - ScaleUp.offset.top;
        return currentX >= ScaleUp.x && currentX <= ScaleUp.x + ScaleUp.r * 2 && currentY >= 0 && currentY <= ScaleUp.r * 2;
    }

}