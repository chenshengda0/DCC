import { borderTopRightRadius } from "html2canvas/dist/types/css/property-descriptors/border-radius";
import { runtimeDecorator } from "../Common";

class ShowImage{
    private x:number = 0;
    private y:number = 0;

    private hx:number = 0;
    private hy:number = 0;

    private fillStyle:any;

    //3d坐标
    private x3d:number = 0;
    private y3d:number = 0;
    private z3d:number = 0;

    private f1:number = 200;

    private width:number = 0;
    private height:number = 0;

    private r:number = 30;
    private angel:number = 0;
    private scale:number = 1;

    private distance:number = 150

    private alpha:number = 1;

    constructor(props:any){
        Object.assign( this, props )
        console.log( this )
        return this;
    }

    draw( ctx:any ){
        ctx.save();
        ctx.fillStyle = this.fillStyle
        ctx.globalAlpha = this.alpha;
        ctx.translate( this.x, this.y )
        ctx.scale( this.scale, this.scale )
        ctx.beginPath()
        ctx.arc( 0, 0, this.r, 0, 2 * Math.PI )
        ctx.closePath();
        ctx.fill()
        ctx.restore()
        return this;
    }

    update(){
        this.angel += 1 / 180 * Math.PI;
        this.angel %= 2 * Math.PI;
        //重置虚拟坐标
        this.y3d = this.distance * Math.sin( this.angel )
        this.z3d = this.distance * Math.cos( this.angel )
        this.scale = this.f1 / ( this.f1 + this.z3d )
        this.y = this.hy + this.y3d * this.scale;
        this.alpha = Math.min( 1, Math.abs( this.scale ) * 0.5 )
        return this;
    }

}

export default class D3Scale{

    private static container:any;
    private static offset:any;

    constructor(domID:any){
        D3Scale.container = document.getElementById( domID )
        D3Scale.offset = D3Scale.container.getBoundingClientRect()
    }

    @runtimeDecorator()
    render(r:number = 10, distance:number = 100){
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = D3Scale.container.clientWidth;
        const H = canvas.height = D3Scale.container.clientHeight;

        const ballColor = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
        ballColor.addColorStop( 0, "rgba(255, 255, 255, 1)" );
        ballColor.addColorStop( 0.3, "rgba(0, 255, 240, 1)" );
        ballColor.addColorStop( 0.5, "rgba(0, 240, 255, 1)" );
        ballColor.addColorStop( 0.8, "rgba(0, 110, 255, 0.8)" );
        ballColor.addColorStop( 1, "rgba(0, 0, 0, 0.2)" );

        const list = new Proxy( function*(){
            yield new ShowImage({
                width: W,
                height: H,
                x3d: W / 4,
                y3d: H / 4,
                z3d: 0,
                x: W / 4,
                y: H / 4,
                hx: W / 4,
                hy: H / 2,
                r,
                fillStyle: ballColor,
                distance,
                angel: 0,
            })
            yield new ShowImage({
                width: W,
                height: H,
                x3d: W / 2,
                y3d: H / 2,
                z3d: 0,
                x: W / 2,
                y: H / 2,
                hx: W / 2,
                hy: H / 2,
                r,
                fillStyle: ballColor,
                distance,
                angel: Math.PI / 3,
            })
            yield new ShowImage({
                width: W,
                height: H,
                x3d: W / 4 * 3,
                y3d: H / 4 * 3,
                z3d: 0,
                x: W / 4 * 3,
                y: H / 4 * 3,
                hx: W / 4 * 3,
                hy: H / 2,
                r,
                fillStyle: ballColor,
                distance,
                angel: Math.PI / 3 * 2,
            })

        }, {
            apply(...args){
                const GEN = Reflect.apply( ...args )
                return [...GEN]
            }
        } )() as unknown as any[];

        ;( function move(){
            ctx.clearRect( 0, 0, W ,H )
            list.map( (row)=> row.draw(ctx))
            list.map( (row)=>row.update() )
            window.requestAnimationFrame( move )
        } )()

        D3Scale.container.appendChild( canvas )
    }

}