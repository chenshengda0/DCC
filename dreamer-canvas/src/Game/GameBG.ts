import ShowBG1 from "./ShowBG1"
import ShowBG2 from "./ShowBG2"
import ShowBG3 from "./ShowBG3"
import ShowBG4 from "./ShowBG4"
import ShowBG5 from "./ShowBG5"


export default class GameBG{
    private static container:any;
    private static offset:any;

    constructor(domID:string){
        GameBG.container = document.getElementById( domID )
        GameBG.offset = GameBG.container.getBoundingClientRect()
    }

    render(){
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = GameBG.container.clientWidth;
        const H = canvas.height = GameBG.container.clientHeight;

        const list = new Proxy( function*(){
            yield new ShowBG1({
                width: W,
                height: H,
            })
            yield new ShowBG2({
                width: W,
                height: H,
            })
            yield new ShowBG3({
                width: W,
                height: H,
            })
            yield new ShowBG4({
                width: W,
                height: H,
            })
            yield new ShowBG5({
                width: W,
                height: H,
            })
        }, {apply:(...args)=>[...Reflect.apply(...args)]} )() as unknown as any[];



        ;( function move(){
            ctx.clearRect( 0, 0, W ,H )
            list.map( (row)=>row.update() )
            list.map( (row)=>row.draw(ctx) )
            window.requestAnimationFrame( move )
        } )()

        GameBG.container.appendChild( canvas )
    }
}