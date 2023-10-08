import {
    runtimeDecorator,
    getRandom,
} from "../Common" 

class Ball{

    private width:number = 0;
    private height:number = 0;
    private fillStyle:any;
    private x:number = 0;
    private y:number = 0;
    private x3d:number = 0;
    private y3d:number = 0;
    private z3d:number = 0;
    private vx:number = 0;
    private vy:number = 0;
    private vz:number = 0;
    private az:number = 0;
    private r:number = 10;
    private f1:number = 250;
    private scaleX:number = 1;
    private scaleY:number = 1;
    private alpha:number = 1
    private maxZ:number = 1200;
    private f:number = 0.8;

    constructor(width:number, height:number, fillStyle:any,  direction:boolean){
        this.width = width;
        this.height = height;
        this.x3d = getRandom( [-this.width*1.5, this.width * 2] )
        this.y3d = getRandom( [-this.height*1.5, this.height * 2] )
        this.z3d = getRandom( [0, this.maxZ] )
        this.vz = getRandom( [-2 ,2] )
        this.az = direction ? getRandom( [1 , 2] ) : -getRandom( [1 , 2] )
        this.fillStyle = fillStyle;
        //设置颜色
        return this; 
    }

    draw(ctx:any){
        ctx.save()
        ctx.fillStyle = this.fillStyle;
        ctx.globalAlpha = this.alpha
        ctx.translate( this.x, this.y )
        ctx.scale( this.scaleX, this.scaleY )
        ctx.beginPath()
        ctx.arc( 0, 0, this.r, 0, 2 * Math.PI )
        ctx.closePath()
        ctx.fill()
        ctx.restore()
        return this;
    }

    update(){
        this.vz += this.az;
        this.vz *= this.f;
        this.z3d += this.vz;
        if( this.z3d < -this.f1 ){
            this.z3d += this.maxZ;
        }
        if( this.z3d > this.maxZ - this.f1  ){
            this.z3d -= this.maxZ;
        }
        const scale = this.f1 / (this.f1 + this.z3d)
        this.scaleX = scale;
        this.scaleY = scale;
        //计算缩放之后的位置
        this.x = this.width / 2 + this.x3d * scale;
        this.y = this.height / 2 + this.y3d * scale;
        this.alpha = Math.min( Math.abs( scale ) * 1.5, 1 )
        return this;
    }

}

export default class D3this{

    private static container:any;
    private static offset:any;

    constructor(domID:string){
        D3this.container = document.getElementById( domID )
        D3this.offset = D3this.container.getBoundingClientRect();
    }

    @runtimeDecorator()
    render(count:number = 300, direction:boolean = false){
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = D3this.container.clientWidth;
        const H = canvas.height = D3this.container.clientHeight;

        const ballColor = ctx.createRadialGradient(0, 0, 0, 0, 0, 10)
        ballColor.addColorStop( 0, "rgba(255, 255, 255, 1)" );
        ballColor.addColorStop( 0.3, "rgba(0, 255, 240, 1)" );
        ballColor.addColorStop( 0.5, "rgba(0, 240, 255, 1)" );
        ballColor.addColorStop( 0.8, "rgba(0, 110, 255, 0.8)" );
        ballColor.addColorStop( 1, "rgba(0, 0, 0, 0.2)" );

        const list = new Proxy( function*(){
            for( let i = 0; i < count; ++i ){
                yield new Ball(W, H, ballColor, direction)
            }
        }, {
            apply(...args){
                const GEN = Reflect.apply( ...args )
                const ANS = [...GEN]
                //console.log( ANS )
                return ANS;
            }
        } )() as unknown as any[]


        ;( function move(){
            //ctx.fillStyle = "rgba(0,0,0,0.4)"
            //ctx.fillRect( 0, 0, W ,H )
            ctx.clearRect( 0, 0, W, H )
            list.map( (row) => row.update() )
            //list.sort( (a,b)=>b.z3d - a.z3d )
            list.map( (row) => row.draw(ctx) )
            window.requestAnimationFrame( move )
        } )()

        D3this.container.appendChild( canvas );

    }

}