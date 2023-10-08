import downloadPng from "./static/downloads.png"
export default class Download{
    private static width:number;
    private static height: number;
    private static x: number;
    private static y: number;
    private static r: number;
    private static img: any;
    private static offset:any;
    constructor(width:number ,height:number, offset:any){
        Download.width = width;
        Download.height = height;
        Download.r = 15;
        Download.img = new Image()
        Download.img.src = downloadPng;
        Download.x = Download.width - 2 * Download.r;
        Download.y = Download.height - 2 * Download.r;
        Download.offset = offset;
        return this;
    }

    draw(ctx:any){
        ctx.save();
        //ctx.fillStyle = "red"
        //ctx.strokeStyle = "red"
        ctx.translate( Download.x, Download.y )
        ctx.beginPath()
        ctx.rect( 0, 0, Download.r * 2, Download.r * 2 )
        ctx.closePath()
        //ctx.fill()
        //ctx.stroke()
        ctx.clip()
        ctx.drawImage( Download.img, 0, 0, Download.img.width, Download.img.height, 0, 0, Download.r * 2, Download.r * 2 )
        ctx.restore();
        return this;
    }

    inArea(x:number, y:number){
        const currentX = x - Download.offset.left;
        const currentY = y - Download.offset.top;
        return currentX >= (Download.width - 2 * Download.r) && currentX <= Download.width && currentY >= (Download.height - 2 * Download.r) && currentY <= Download.height;
    }
}