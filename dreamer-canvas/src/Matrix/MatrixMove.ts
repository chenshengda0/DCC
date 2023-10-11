import {
    getAxis,
    runtimeDecorator,
} from "../Common"

class ShowImage{

    private width:number = 0;
    private height:number = 0;
    //@ts-ignore
    private matrix:number[][] = MATRIX;
    private offset:any;
    private img:any;
    private r:number = 100;
    private scale:number = 1
    private alpha:number = 1;

    constructor(props:any){
        Object.assign( this, props )
        console.log( this.matrix )
        this.matrix[0][3] = this.width / 2;
        this.matrix[1][3] = this.height / 2;
        return this;
    }

    draw(ctx:any){
        //计算中心点当前位置
        const point = new Proxy( function*(){
            yield [-15, 25, 0, 1]
            yield [15, 25, 0, 1]
            yield [15, -25, 0, 1]
            yield [-15, -25, 0, 1]
        }, {
            apply: (...args)=>[...Reflect.apply(...args)]
        } )() as unknown as number[][]
        const points = getAxis( this.matrix, point, true )
        //计算缩放比例
        const scale = 200 / ( 200 + points[0][2] )
        ctx.save();
        ctx.scale(scale , scale)
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = "red"
        ctx.beginPath()
        for( const current of points ){
            ctx.lineTo(current[0], current[1])
        }
        ctx.closePath()
        //ctx.stroke()
        ctx.fill()
        ctx.restore()
        return this;
    }

    private move(){
        this.matrix[0][3] += 0.05;
        this.matrix[1][3] += 0.05;
        this.matrix[2][3] += 5;
        if( this.matrix[2][3] > 1200 ){
            this.matrix[2][3] = 0
            this.matrix[0][3] = this.width / 2
            this.matrix[1][3] = this.height / 2
        }
        
    }

    private rotate(){
        this.matrix = getAxis( this.matrix, new Proxy( function*(){
            yield [Math.cos( 1 / 180 * Math.PI ), -Math.sin( 1 / 180 * Math.PI ), 0, 0]
            yield [Math.sin( 1 / 180 * Math.PI ), Math.cos( 1 / 180 * Math.PI ), 0, 0]
            yield [0, 0, 1, 0]
            yield [0, 0, 0, 1]
        },{
            apply(...args){
                return [ ...Reflect.apply(...args) ]
            }
        } )() as unknown as number[][] )
    }

    private initScale(){
        this.scale = 200 / (200 + this.matrix[2][3]);
        this.alpha = Math.min( 1, Math.abs(this.scale) )
    }

    update(){
        this.move()
        this.rotate()
        this.initScale()
        return ;
    }

}

export default class MatrixMove{

    private static container:any;
    private static offset:any;

    constructor(domID:string){
        MatrixMove.container = document.getElementById( domID )
        MatrixMove.offset = MatrixMove.container.getBoundingClientRect()
        return this;
    }


    @runtimeDecorator()
    render(){
        //主canvas
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = MatrixMove.container.clientWidth;
        const H = canvas.height = MatrixMove.container.clientHeight;
        const show = new ShowImage({
            height: H,
            width: W,
        });
        ;( function move(){
            ctx.clearRect( 0, 0, W, H )
            show.draw( ctx )
            show.update()
            window.requestAnimationFrame( move )
        } )()

        MatrixMove.container.appendChild( canvas )

    }

}