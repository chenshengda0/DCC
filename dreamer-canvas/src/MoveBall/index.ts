import {
    Ball,
    runtimeDecorator,
} from "../Common"
export default class MoveBall{

    container: any;
    offset: any;

    constructor(idTab: string){
        this.container = document.getElementById( idTab )
        this.offset = this.container.getBoundingClientRect()
    }

    @runtimeDecorator()
    render(r:number = 20, fillStyle:string = "red" ){
        const canvas:any = document.createElement( "canvas" )
        const ctx = canvas.getContext( "2d" )
        const W = canvas.width = this.container.clientWidth; 
        const H = canvas.height = this.container.clientHeight;
        
        const ball = new Ball({
            x: W / 2,
            y: H / 2,
            r,
            width: W,
            height: H,
            fillStyle,
        })
        
        const moveBall = (e:any)=>{
            ball.x = e.x - this.offset.left;
            ball.y = e.y - this.offset.top;
        }
        
        //获取坐标
        canvas.addEventListener( "mousedown", (e:any)=>{
            e.preventDefault()
            if( ball.inBlock( e.x - this.offset.left, e.y - this.offset.top ) ){
                canvas.addEventListener( "mousemove", moveBall)
                canvas.addEventListener( "mouseup", function(e:any){
                    canvas.removeEventListener( "mousemove", moveBall )
                }, {once: true} )
            }
        })
        
        ;( function move(){
            window.requestAnimationFrame( move )
            ctx.clearRect( 0, 0, W, H )
            ball.draw( ctx )
        } )()
        
        this.container.appendChild( canvas )
        return;
    }

}