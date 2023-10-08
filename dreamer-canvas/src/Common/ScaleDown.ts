import scaleDownIcon from "./static/scaledown.png"

export default class ScaleDown{

    private static x:number = 60;
    private static y:number = 0;
    private static width:number;
    private static height:number;
    private static offset:any;
    private static img:any;
    private static r:number = 15;

    constructor(width:number, height:number, offset:number){
        ScaleDown.img = new Image();
        ScaleDown.width = width;
        ScaleDown.height = height;
        ScaleDown.offset = offset;
        ScaleDown.img.src = scaleDownIcon;
    }

    draw(ctx:any){
        ctx.save();
        ctx.translate( ScaleDown.x, ScaleDown.y )
        ctx.beginPath()
        ctx.rect( 0, 0, ScaleDown.r << 1, ScaleDown.r << 1 )
        ctx.closePath()
        ctx.clip()
        ctx.drawImage( ScaleDown.img, 0, 0, ScaleDown.img.width, ScaleDown.img.height, 0, 0, ScaleDown.r << 1, ScaleDown.r << 1 )
        ctx.restore();
        return this;
    }

    inArea(x:number, y:number){
        const currentX = x - ScaleDown.offset.left;
        const currentY = y - ScaleDown.offset.top;
        return currentX >= ScaleDown.x && currentX <= ScaleDown.x + ScaleDown.r * 2 && currentY >= 0 && currentY <= ScaleDown.r * 2;
    }

}