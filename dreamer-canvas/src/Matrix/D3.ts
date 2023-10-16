import {
    getAxis,
    matrix2D,
} from "../Common"

class ShowImage{
    x:number = 0
    y:number = 0
    z:number = 0
    width:number = 0;
    height:number = 0;
    matrix:number[][] = [ [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1] ]
    r:number = 10;
    angel:number = 0;

    constructor(props:any){
        Object.assign( this, props )
        return this;
    }

    draw(ctx:any){
        //计算当前坐标
        const current = getAxis( this.matrix, [ [this.x, this.y, this.z, 1] ], true )
        const scale = 250 / ( 250 + current[0][2] )
        ctx.save()
        ctx.translate( this.width / 2, this.height / 2 )
        ctx.scale( scale, scale )
        ctx.fillStyle = "red"
        ctx.beginPath()
        ctx.arc( current[0][0], current[0][1], this.r, 0 , 2 * Math.PI )
        ctx.closePath()
        ctx.fill()
        ctx.restore()
        return this;
    }

    xAxis(){
        this.angel += 1 / 180 * Math.PI
        this.angel %= 2 * Math.PI
        this.matrix[1][1] = Math.cos( this.angel )
        this.matrix[1][2] = -Math.sin( this.angel )
        this.matrix[2][1] = Math.sin( this.angel )
        this.matrix[2][2] = Math.cos( this.angel )
        return this;
    }

    yAxis(){
        this.angel += 1 / 180 * Math.PI
        this.angel %= 2 * Math.PI
        this.matrix[0][0] = Math.cos( this.angel )
        this.matrix[0][2] = -Math.sin( this.angel )
        this.matrix[2][0] = Math.sin( this.angel )
        this.matrix[2][2] = Math.cos( this.angel )
        return this;
    }

    zAxis(){
        this.angel += 1 / 180 * Math.PI
        this.angel %= 2 * Math.PI
        this.matrix[0][0] = Math.cos( this.angel )
        this.matrix[0][1] = -Math.sin( this.angel )
        this.matrix[1][0] = Math.sin( this.angel )
        this.matrix[1][1] = Math.cos( this.angel )
        return this;
    }

    update(axis:"x"|"X"|"y"|"Y"|"z"|"Z" = "x"){
        switch(true){
            case axis.toLocaleLowerCase() === "x":
                this.xAxis();
                break;
            case axis.toLocaleLowerCase() === "y":
                this.yAxis();
                break;
            default:
                this.zAxis();
                break;
        }
    }

}


export default class D3{

    private static container:any;
    private static offset:any;

    constructor(domID:string){
        D3.container = document.getElementById( domID )
        D3.offset = D3.container.getBoundingClientRect()
    }



    render(axis:"x"|"X"|"y"|"Y"|"z"|"Z" = "y"){
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = D3.container.clientWidth;
        const H = canvas.height = D3.container.clientHeight;

        const doms = new Proxy( function*(){
            let angel = 0;
            while( angel < 2 * Math.PI ){
                const x = 80 * Math.cos( angel )
                const y = 80 * Math.sin( angel )
                angel +=  Math.PI / 6
                yield new ShowImage({
                    width: W,
                    height: H,
                    x,
                    y,
                    matrix: [
                        [1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1],
                    ],
                    angel: 0,
                })
            }
        }, {apply:(...args)=>[...Reflect.apply(...args)]} )() as unknown as any[];
        console.log( doms )

        console.log( getAxis( [
            [Math.cos( Math.PI / 9 ), 0, -Math.sin( Math.PI / 12 ), 0],
            [0, 1, 0, 0],
            [Math.sin( Math.PI / 9 ), 0, Math.cos( Math.PI / 12 ), 0],
            [0, 0, 0, 1],
        ], [
            [ 100 , 100, 100, 1]
        ], true ) )

        ;( function move(){
            ctx.clearRect( 0, 0, W ,H )
            doms.map( (dom)=>dom.update( axis ) )
            doms.map( (dom)=>dom.draw( ctx ) )
            window.requestAnimationFrame( move )
        } )()

        D3.container.appendChild( canvas )
    }

}