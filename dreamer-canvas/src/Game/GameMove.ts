import dogIcon from "./static/dog_left_right_white.png"
import {
    getAxis,
    matrix2D,

    Up,
    Down,
    Left,
    Right,
} from "../Common"

import {
    StandingLeft,
    StandingRight,
    SquatLeft,
    SquatRight,
    RunningLeft,
    RunningRight,
    RollLeft,
    RollRight,
    JumpLeft,
    JumpRight,
    FallingLeft,
    FallingRight,
} from "./State"

class ShowImage{

    private static tcanvas:any; 
    private static iWidth:number = 1800 / 9;
    private static iHeight:number = 2182 / 12;
    private static lastStatus:string = "";
    private static states:any;
    private static currentState:number = 0;
    width:number = 0;
    height:number = 0;
    matrix:number[][] = [ [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1] ]
    frameX:number = 0;
    frameY:number = 0;
    maxframe:number = 7;
    speed:number = 0;
    vx:number = 0;
    vy:number = 0;
    g:number = 0.5;
    


    constructor(props:any){
        Object.assign( this, props )
        const tcanvas = document.createElement( "canvas" )
        const tctx:any = tcanvas.getContext( "2d" )
        const img = new Image()
        img.src = dogIcon
        img.addEventListener( "load", function(){
            tcanvas.width = img.width;
            tcanvas.height = img.height;
            tctx.drawImage( img, 0, 0 )
        } )
        ShowImage.tcanvas = tcanvas;
        ShowImage.states = [ 
            new StandingLeft( this ),
            new StandingRight( this ),
            new SquatLeft( this ),
            new SquatRight( this ),
            new RunningLeft( this ),
            new RunningRight( this ),
            new RollLeft( this ),
            new RollRight( this ),
            new JumpLeft( this ),
            new JumpRight( this ),
            new FallingLeft( this ),
            new FallingRight( this ),
        ]
        return this;
    }

    draw( ctx:any ){
        //移动
        this.matrix[0][3] += this.vx;
        //左右边界
        if( this.matrix[0][3] - (ShowImage.iWidth / 4 ) <= 0 ){
            this.matrix[0][3] = ShowImage.iWidth / 4
        }
        if( this.matrix[0][3] + (ShowImage.iWidth / 4) >= this.width ){
            this.matrix[0][3] = this.width - (ShowImage.iWidth / 4);
        }
        this.matrix[1][3] += this.vy;
        
        if( !this.onGround() ){
            this.vy += this.g;
        }else{
            this.vy = 0;
            this.matrix[1][3] = this.height - (ShowImage.iHeight / 4) - 30;
        }
        //动画帧
        this.frameX++;
        this.frameX %= this.maxframe;
        ctx.save()
        ctx.setTransform( ...matrix2D( this.matrix ) )
        ctx.drawImage( ShowImage.tcanvas, this.frameX * ShowImage.iWidth, this.frameY * ShowImage.iHeight, ShowImage.iWidth, ShowImage.iHeight, -ShowImage.iWidth / 4, -ShowImage.iHeight / 4, ShowImage.iWidth / 2, ShowImage.iHeight / 2 )
        ctx.restore()
        return this;
    }

    setState(state:number){
        ShowImage.currentState = state;
        ShowImage.states[ ShowImage.currentState ].enter()
        return this;
    }


    onChange(status:string = ""){
        // if( status === "" ) return;
        // if( status === ShowImage.lastStatus  ) return;
        ShowImage.lastStatus = status;
        //绑定状态
        ShowImage.states[ ShowImage.currentState ].handleInput( ShowImage.lastStatus )
    }

    onGround(){
        return this.matrix[1][3] >= this.height - 30 - (ShowImage.iHeight / 4)
    }

}

export default class GameMove{
    private static container:any;
    private static offset:any;

    constructor(domID:string){
        GameMove.container = document.getElementById( domID )
        GameMove.offset = GameMove.container.getBoundingClientRect()
    }

    render(){
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = GameMove.container.clientWidth;
        const H = canvas.height = GameMove.container.clientHeight;

        const show = new ShowImage({
            width: W,
            height: H,
            matrix: [
                [1, 0, 0, W / 2 ],
                [0, 1, 0, H - 30 ],
                [0, 0, 1, 0 ],
                [0, 0, 0, 1 ],
            ]
        })

        //console.log( show )

        const handles = new Proxy( function*(){
            yield new Up( {
                width: W, 
                height: H,
                offset: GameMove.offset,
                matrix: [
                    [1, 0, 0, 15],
                    [0, 1, 0, H - 15],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ]
            } )
            yield new Left( {
                width: W, 
                height: H,
                offset: GameMove.offset,
                matrix: [
                    [1, 0, 0, 45],
                    [0, 1, 0, H - 15],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ]
            } )
            yield new Right( {
                width: W, 
                height: H,
                offset: GameMove.offset,
                matrix: [
                    [1, 0, 0, 75],
                    [0, 1, 0, H - 15],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ]
            } )
            yield new Down( {
                width: W, 
                height: H,
                offset: GameMove.offset,
                matrix: [
                    [1, 0, 0, 105],
                    [0, 1, 0, H - 15],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ]
            } )
        }, { apply:(...args)=>[...Reflect.apply(...args)] } )() as unknown as any[];

        //最后输入
        let handleStatus = "";
        canvas.addEventListener( "touchstart", function(e){
            e.preventDefault()
            switch(true){
                case handles[0].inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    handleStatus = "ENTER UP"
                    canvas.addEventListener( "touchend", () => handleStatus = "RELEASE UP", true )
                    break;
                case handles[1].inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    handleStatus = "ENTER LEFT"
                    canvas.addEventListener( "touchend", () => handleStatus = "RELEASE LEFT", true )
                    break;
                case handles[2].inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    handleStatus = "ENTER RIGHT"
                    canvas.addEventListener( "touchend", () => handleStatus = "RELEASE RIGHT", true )
                    break;
                case handles[3].inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    handleStatus = "ENTER DOWN"
                    canvas.addEventListener( "touchend", () => handleStatus = "RELEASE DOWN", true )
                    break;
                default:
                    const x = e.touches[0].pageX - GameMove.offset.left
                    const y = e.touches[0].pageY - GameMove.offset.top
                    //获取当前点颜色
                    const metaData:any = ctx?.getImageData( x, y , 1, 1 )
                    const r = metaData.data[0]
                    const g = metaData.data[1]
                    const b = metaData.data[2]
                    const a = metaData.data[3] / 255
                    const gray = (r * 0.3 + g * 0.59 + b * 0.11) | 0;
                    window.dispatchEvent( new CustomEvent( "dream_canvas_show_color",{ detail: {
                        axis: {x, y},
                        rgb: `rgba(${r},${g},${b},${a})`,
                        hex: `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`,
                        gray: `rgb(${gray},${gray},${gray},1)`,
                    } } ) )
                    break;
            }
        } )

        ;( function move(){
            ctx.clearRect( 0, 0, W, H )
            show.onChange( handleStatus )
            show.draw( ctx )
            handles.map( (row)=>row.draw(ctx) )
            window.requestAnimationFrame( move )
        } )()

        GameMove.container.appendChild( canvas )
    }
}