import bg1icon from "./static/layer-1.png"
export default class ShowImage{
    matrix:number[][] = [ [1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1] ]
    private static tcanvas:any;
    private static iwidth:number = 2400;
    private static iheight:number = 782;
    private static pos1x:number = 0
    private static pos1y:number = 0
    private static pos2x:number = 2400
    private static pos2y:number = 0
    private static modules:number = 0.3;
    speed:number = 5;
    width:number = 0;
    height:number = 0;

    constructor(props:any){
        Object.assign( this, props )
        const tcanvas = document.createElement( "canvas" )
        const tctx:any = tcanvas.getContext( "2d" )
        const IW = tcanvas.width = ShowImage.iwidth;
        const IH = tcanvas.height = this.height;
        const img = new Image()
        img.src = bg1icon;
        img.addEventListener( "load", function(){
            tctx.drawImage( img, 0, 0, IW, IH )
        } )
        ShowImage.tcanvas = tcanvas;
        return this;
    }

    draw(ctx:any){
        ctx.save()
        ctx.drawImage( ShowImage.tcanvas, ShowImage.pos1x, ShowImage.pos1y  )
        ctx.drawImage( ShowImage.tcanvas, ShowImage.pos2x, ShowImage.pos2y )
        ctx.restore()
        return this;
    }

    update(){
        ShowImage.pos1x -= ShowImage.modules
        ShowImage.pos2x -= ShowImage.modules
        if( ShowImage.pos1x < -ShowImage.iwidth ) ShowImage.pos1x = ShowImage.iwidth + ShowImage.pos2x - ShowImage.modules
        if( ShowImage.pos2x < -ShowImage.iwidth ) ShowImage.pos2x = ShowImage.iwidth + ShowImage.pos1x - ShowImage.modules
        return this;
    }
}