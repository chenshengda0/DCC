import uploadPng from "./static/uploads.png"
export default class Upload{
    private static width:number;
    private static height: number;
    private static x: number;
    private static y: number;
    private static r: number;
    private static img: any;
    private static offset:any;
    constructor(width:number ,height:number, offset:any){
        Upload.width = width;
        Upload.height = height;
        Upload.r = 15;
        Upload.img = new Image()
        Upload.img.src = uploadPng;
        Upload.x = 0;
        Upload.y = 0;
        Upload.offset = offset;
        return this;
    }

    draw(ctx:any){
        ctx.save();
        ctx.translate( Upload.x, Upload.y )
        ctx.beginPath()
        ctx.rect( 0, 0, Upload.r * 2, Upload.r * 2 )
        ctx.closePath()
        ctx.clip()
        ctx.drawImage( Upload.img, 0, 0, Upload.img.width, Upload.img.height, 0, 0, Upload.r * 2, Upload.r * 2 )
        ctx.restore();
        return this;
    }

    inArea(x:number, y:number){
        const currentX = x - Upload.offset.left;
        const currentY = y - Upload.offset.top;
        return currentX >= 0 && currentX <= Upload.r * 2 && currentY >= 0 && currentY <= Upload.r * 2;
    }
}