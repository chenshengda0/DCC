import {
    runtimeDecorator,
} from "../Common"

class Ball{
    private static x:number;
    private static y:number;
    private static r:number;
    private static width: number;
    private static height: number;
    private static fillStyle: string;
    private static offset:any;
    private static diffX:number;
    private static diffY:number;

    constructor(r:number, fillStyle:string, width: number, height: number, offset:any){
        Ball.width = width;
        Ball.height = height;
        Ball.x  = Ball.width / 2;
        Ball.y = Ball.height / 2;
        Ball.diffX = 0;
        Ball.diffY = 0
        Ball.r = r;
        Ball.fillStyle = fillStyle
        Ball.offset = offset;
        return this;
    }

    draw(ctx:any){
        ctx.save()
        ctx.fillStyle = Ball.fillStyle;
        ctx.translate( Ball.x, Ball.y )
        ctx.beginPath()
        ctx.arc( 0, 0, Ball.r, 0, Math.PI * 2 )
        ctx.closePath()
        ctx.fill()
        ctx.restore()
        return this;
    }

    inArea(x: number, y:number){
        const currentX = x - Ball.offset.left;
        const currentY = y - Ball.offset.top;
        return Math.sqrt( (currentX - Ball.x) ** 2 + (currentY - Ball.y) ** 2 ) < Ball.r; 
    }

    initDiff(x:number, y: number){
        const currentX = x - Ball.offset.left;
        const currentY = y - Ball.offset.top;
        Ball.diffX = currentX - Ball.x;
        Ball.diffY = currentY - Ball.y;
        return this;
    }

    onMove(e:any){
        Ball.x = e.touches[0].pageX - Ball.offset.left - Ball.diffX;
        Ball.y = e.touches[0].pageY - Ball.offset.top - Ball.diffY;
        if( Ball.x - Ball.r <= 0 ){
            Ball.x = Ball.r;
        }
        if( Ball.x + Ball.r >= Ball.width ){
            Ball.x = Ball.width - Ball.r;
        }
        if( Ball.y - Ball.r <= 0 ){
            Ball.y = Ball.r;
        }
        if( Ball.y + Ball.r >= Ball.height ){
            Ball.y = Ball.height - Ball.r;
        }
    }

}

export default class MoveBall{

    private static container: any;
    private static offset: any;

    constructor(domID: string){
        MoveBall.container = document.getElementById( domID )
        MoveBall.offset = MoveBall.container.getBoundingClientRect()
    }

    @runtimeDecorator()
    render(r:number = 50, fillStyle:string = "red" ){
        const canvas:any = document.createElement( "canvas" )
        const ctx = canvas.getContext( "2d" )
        const W = canvas.width = MoveBall.container.clientWidth; 
        const H = canvas.height = MoveBall.container.clientHeight;
        
        const ball = new Ball(r, fillStyle, W, H, MoveBall.offset)

        canvas.addEventListener( "touchstart", (e:any)=>{
            switch( true ){
                case ball.inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    //初始化差值
                    ball.initDiff( e.touches[0].pageX, e.touches[0].pageY )
                    canvas.addEventListener( "touchmove", ball.onMove )
                    canvas.addEventListener( "touchend", ()=>canvas.removeEventListener( "touchmove", ball.onMove ), {once: true} )
                    break;
                default:
                    break;
            }
        } )
        
        ;( function move(){
            ctx.clearRect( 0, 0, W, H )
            ball.draw( ctx )
            window.requestAnimationFrame( move )
        } )()
        
        MoveBall.container.appendChild( canvas )
        return;
    }

}