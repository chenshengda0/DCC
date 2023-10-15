import Icon from "./static/left.png"
import {
    matrix2D,
    getAxis,
} from "./utils" 
export default class Left{
    private static iWidth:number = 30
    private static iHeight:number = 30;
    private static tcanvas:any;
    width:number = 0;
    height:number = 0;
    matrix:number[][] = [ [1, 0, 0, 0],[0, 1, 0, 0],[0, 0, 1, 0],[0, 0, 0, 1] ]
    offset:any;

    constructor( props:any ){
        Object.assign( this, props )
        const tcanvas = document.createElement( "canvas" )
        const tctx:any = tcanvas.getContext( "2d" )
        const img = new Image()
        img.src = Icon;
        img.addEventListener( "load", function(){
            tcanvas.width = img.width;
            tcanvas.height = img.height;
            tctx.drawImage( img, 0, 0 )
        } )
        Left.tcanvas = tcanvas;
        return this;
    }

    draw(ctx:any){
        ctx.save()
        ctx.setTransform( ...matrix2D( this.matrix ) )
        ctx.drawImage( Left.tcanvas, 0, 0, Left.tcanvas.width, Left.tcanvas.height, -Left.iWidth / 2, -Left.iHeight / 2, Left.iWidth, Left.iHeight )
        ctx.restore()
        return this;
    }

    inArea(x:number , y:number){
        const currentX = x - this.offset.left;
        const currentY = y - this.offset.top;
        const matrix = JSON.parse( JSON.stringify( this.matrix ) );
        matrix[0][3] *= -1;
        matrix[1][3] *= -1;
        const current = getAxis( matrix, [ [currentX, currentY, 0, 1] ], true )
        return Math.abs(current[0][0]) <= Left.iWidth / 2 && Math.abs(current[0][1]) <= Left.iHeight / 2;
    }
}