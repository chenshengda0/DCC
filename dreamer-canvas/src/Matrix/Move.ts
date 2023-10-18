import {
    getAxis,
    matrix2D,
    determinant,
    adjoint,
    invert,
} from "../Common"

import icon from "./static/1696385680872.png"

class ShowImage{
    private static iWidth:number = 400;
    private static iHeight:number = 600;
    private static tcanvas:any;
    private static angel:number = 0;

    width:number = 0;
    height:number = 0;
    matrix:number[][] = [ [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1] ]
    
    constructor(props:any){
        Object.assign( this, props )
        const tcanvas = document.createElement( "canvas" )
        const tctx:any = tcanvas.getContext( "2d" )
        const img = new Image();
        img.src = icon;
        img.addEventListener( "load", function(){
            tcanvas.width = img.width;
            tcanvas.height = img.height;
            tctx.drawImage( img, 0, 0 )
        } )
        ShowImage.tcanvas = tcanvas;
        return this;
    }

    draw(ctx:any){
        ctx.save();
        ctx.setTransform( ...matrix2D( this.matrix ) )
        ctx.drawImage( ShowImage.tcanvas, 0, 0, ShowImage.iWidth, ShowImage.iHeight, -this.width / 2, -this.height / 2, this.width, this.height )
        ctx.restore()
        return this;
    }

    update(){
        ShowImage.angel += 1 / 180 * Math.PI
        ShowImage.angel %= 2 * Math.PI
        this.matrix[0][0] = Math.cos( ShowImage.angel )
        this.matrix[0][1] = -Math.sin( ShowImage.angel )
        this.matrix[1][0] = Math.sin( ShowImage.angel )
        this.matrix[1][1] = Math.cos( ShowImage.angel )
        return this;
    }

}

export default class Move{
    private static container:any;
    private static offset:any;

    constructor(domID:string){
        Move.container = document.getElementById( domID )
        Move.offset = Move.container.getBoundingClientRect()
    }

    render(){
        const canvas = document.createElement( "canvas" )
        const ctx = canvas.getContext( "2d" )
        const W = canvas.width = Move.container.clientWidth;
        const H = canvas.height = Move.container.clientHeight;
        const show = new ShowImage({
            width: W,
            height: H,
            matrix: [ [1, 0, 0, W / 2], [0, 1, 0, H / 2], [0, 0, 1, 0], [0, 0, 0, 1] ]
        })

        
        const m = [
            [1, 1],
            [2, 4],
        ]

        console.log( m )
        console.log( determinant( m ) )
        const m1 = adjoint( m )
        const m2 = getAxis( m, m1 );
        //const m3 = invert( m )
        //const m4 = getAxis( m, m3 )
        const l = determinant( m );
        console.log( "矩阵行列式: ", l )
        console.log( "矩阵乘积: ", m2 )
        const res = getAxis( m1, [[10, 28]], true )
        const r = new Proxy( function*(){
            for( const row of res[0] ) yield row / l;
        }, {apply:(...args)=>[...Reflect.apply(...args)]} )() as unknown as number[]
        console.log( r )
        ;( function move(){
            ctx?.clearRect( 0, 0, W, H )
            show.update()
            show.draw( ctx )
            window.requestAnimationFrame( move )
        } )()

        Move.container.appendChild( canvas )
    }
}