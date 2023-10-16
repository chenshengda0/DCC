import {
    matrix2D,
} from "../Common"

import enemy1 from "./static/enemy1.png"
import enemy2 from "./static/enemy2.png"
import enemy3 from "./static/enemy3.png"
import enemy4 from "./static/enemy4.png"


class ShowEnemyOne{

    private static tcanvas:any;
    private static iWidth:number = 0;
    private static iHeight:number = 0;
    private static frameX:number = 0;
    private static frameY:number = 0;
    private static maxFrame:number = 6;
    width:number = 0;
    height:number = 0;

    matrix:number[][] = [ [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1] ] 

    constructor(props:any){
        Object.assign( this, props )
        const img = new Image()
        img.src = enemy1;
        const tcanvas = document.createElement( "canvas" )
        const tctx:any = tcanvas.getContext( "2d" )
        img.addEventListener( "load", function(){
            tcanvas.width = img.width;
            tcanvas.height = img.height;
            ShowEnemyOne.iWidth = img.width / ShowEnemyOne.maxFrame;
            ShowEnemyOne.iHeight = img.height;
            tctx.drawImage( img, 0, 0 )
        } )
        ShowEnemyOne.tcanvas = tcanvas;
        return this;
    }

    draw(ctx:any){
        //console.log( this.matrix )
        ShowEnemyOne.frameX++;
        ShowEnemyOne.frameX %= ShowEnemyOne.maxFrame;
        ctx.save();
        ctx.setTransform( ...matrix2D( this.matrix ) )
        ctx.drawImage( ShowEnemyOne.tcanvas, ShowEnemyOne.frameX * ShowEnemyOne.iWidth, ShowEnemyOne.frameY * ShowEnemyOne.iHeight, ShowEnemyOne.iWidth, ShowEnemyOne.iHeight, -ShowEnemyOne.iWidth >> 2, -ShowEnemyOne.iHeight >> 2, ShowEnemyOne.iWidth >> 1, ShowEnemyOne.iHeight >> 1  )
        ctx.restore();
        return this;
    }

}
class ShowEnemyTwo{

    private static tcanvas:any;
    private static iWidth:number = 0;
    private static iHeight:number = 0;
    private static frameX:number = 0;
    private static frameY:number = 0;
    private static maxFrame:number = 6;
    width:number = 0;
    height:number = 0;

    matrix:number[][] = [ [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1] ] 

    constructor(props:any){
        Object.assign( this, props )
        const img = new Image()
        img.src = enemy2;
        const tcanvas = document.createElement( "canvas" )
        const tctx:any = tcanvas.getContext( "2d" )
        img.addEventListener( "load", function(){
            tcanvas.width = img.width;
            tcanvas.height = img.height;
            ShowEnemyTwo.iWidth = img.width / ShowEnemyTwo.maxFrame;
            ShowEnemyTwo.iHeight = img.height;
            tctx.drawImage( img, 0, 0 )
        } )
        ShowEnemyTwo.tcanvas = tcanvas;
        return this;
    }

    draw(ctx:any){
        //console.log( this.matrix )
        ShowEnemyTwo.frameX++;
        ShowEnemyTwo.frameX %= ShowEnemyTwo.maxFrame;
        ctx.save();
        ctx.setTransform( ...matrix2D( this.matrix ) )
        ctx.drawImage( ShowEnemyTwo.tcanvas, ShowEnemyTwo.frameX * ShowEnemyTwo.iWidth, ShowEnemyTwo.frameY * ShowEnemyTwo.iHeight, ShowEnemyTwo.iWidth, ShowEnemyTwo.iHeight, -ShowEnemyTwo.iWidth >> 2, -ShowEnemyTwo.iHeight >> 2, ShowEnemyTwo.iWidth >> 1, ShowEnemyTwo.iHeight >> 1  )
        ctx.restore();
        return this;
    }

}

class ShowEnemyThree{

    private static tcanvas:any;
    private static iWidth:number = 0;
    private static iHeight:number = 0;
    private static frameX:number = 0;
    private static frameY:number = 0;
    private static maxFrame:number = 6;
    width:number = 0;
    height:number = 0;

    matrix:number[][] = [ [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1] ] 

    constructor(props:any){
        Object.assign( this, props )
        const img = new Image()
        img.src = enemy3;
        const tcanvas = document.createElement( "canvas" )
        const tctx:any = tcanvas.getContext( "2d" )
        img.addEventListener( "load", function(){
            tcanvas.width = img.width;
            tcanvas.height = img.height;
            ShowEnemyThree.iWidth = img.width / ShowEnemyThree.maxFrame;
            ShowEnemyThree.iHeight = img.height;
            tctx.drawImage( img, 0, 0 )
        } )
        ShowEnemyThree.tcanvas = tcanvas;
        return this;
    }

    draw(ctx:any){
        //console.log( this.matrix )
        ShowEnemyThree.frameX++;
        ShowEnemyThree.frameX %= ShowEnemyThree.maxFrame;
        ctx.save();
        ctx.setTransform( ...matrix2D( this.matrix ) )
        ctx.drawImage( ShowEnemyThree.tcanvas, ShowEnemyThree.frameX * ShowEnemyThree.iWidth, ShowEnemyThree.frameY * ShowEnemyThree.iHeight, ShowEnemyThree.iWidth, ShowEnemyThree.iHeight, -ShowEnemyThree.iWidth >> 2, -ShowEnemyThree.iHeight >> 2, ShowEnemyThree.iWidth >> 1, ShowEnemyThree.iHeight >> 1  )
        ctx.restore();
        return this;
    }

}
class ShowEnemyFour{

    private static tcanvas:any;
    private static iWidth:number = 0;
    private static iHeight:number = 0;
    private static frameX:number = 0;
    private static frameY:number = 0;
    private static maxFrame:number = 9;
    width:number = 0;
    height:number = 0;

    matrix:number[][] = [ [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1] ] 

    constructor(props:any){
        Object.assign( this, props )
        const img = new Image()
        img.src = enemy4;
        const tcanvas = document.createElement( "canvas" )
        const tctx:any = tcanvas.getContext( "2d" )
        img.addEventListener( "load", function(){
            tcanvas.width = img.width;
            tcanvas.height = img.height;
            ShowEnemyFour.iWidth = img.width / ShowEnemyFour.maxFrame;
            ShowEnemyFour.iHeight = img.height;
            tctx.drawImage( img, 0, 0 )
        } )
        ShowEnemyFour.tcanvas = tcanvas;
        return this;
    }

    draw(ctx:any){
        //console.log( this.matrix )
        ShowEnemyFour.frameX++;
        ShowEnemyFour.frameX %= ShowEnemyFour.maxFrame;
        ctx.save();
        ctx.setTransform( ...matrix2D( this.matrix ) )
        ctx.drawImage( ShowEnemyFour.tcanvas, ShowEnemyFour.frameX * ShowEnemyFour.iWidth, ShowEnemyFour.frameY * ShowEnemyFour.iHeight, ShowEnemyFour.iWidth, ShowEnemyFour.iHeight, -ShowEnemyFour.iWidth >> 2, -ShowEnemyFour.iHeight >> 2, ShowEnemyFour.iWidth >> 1, ShowEnemyFour.iHeight >> 1  )
        ctx.restore();
        return this;
    }

}



export default class Animation{

    private static container:any;
    private static offset:any;

    constructor(domID:string){
        Animation.container = document.getElementById( domID )
        Animation.offset = Animation.container.getBoundingClientRect()
    }

    render(){
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = Animation.container.clientWidth;
        const H = canvas.height = Animation.container.clientHeight;

        const doms = new Proxy( function*(){
            yield new ShowEnemyOne({
                width: W,
                height: H,
                matrix: [
                    [1, 0, 0, W / 4],
                    [0, 1, 0, H / 4],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ]
            })
            yield new ShowEnemyTwo({
                width: W,
                height: H,
                matrix: [
                    [1, 0, 0, W / 4 * 3],
                    [0, 1, 0, H / 4],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ]
            })
            yield new ShowEnemyThree({
                width: W,
                height: H,
                matrix: [
                    [1, 0, 0, W / 4],
                    [0, 1, 0, H / 4 * 3],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ]
            })
            yield new ShowEnemyFour({
                width: W,
                height: H,
                matrix: [
                    [1, 0, 0, W / 4 * 3],
                    [0, 1, 0, H / 4 * 3],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ]
            })
        }, {apply:(...args)=>[...Reflect.apply(...args)]} )() as unknown as any[];

        ;( function move(){
            ctx.clearRect( 0, 0, W ,H )
            doms.map( (row)=>row.draw( ctx ) )
            window.requestAnimationFrame( move )
        } )()

        Animation.container.appendChild( canvas )
    }

}