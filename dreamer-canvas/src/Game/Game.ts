import {
    getAxis,
    getRandom,
    matrix2D,
    impact,
} from "../Common"

class Ball{
    matrix:number[][] = [ [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1] ]
    width:number = 0;
    height:number = 0;
    vx:number = 0;
    vy:number = 0;
    fillStyle:string = "red"
    R:number = 30;
    r:number = 15;
    angel:number = 0;
    horm: number = 5;
    diretion:number = -1


    constructor(props:any){
        Object.assign( this, props )
        this.r = this.R / 2;
        return this;
    }

    draw(ctx:any){
        const {r, R, horm} = this;
        const paths = new Proxy( function*(count:number){
            for( let i = 0; i < count ; ++i ){
                const Rradian = 2 * Math.PI / count * i + 18 / 180 * Math.PI;
                const rradian = 2 * Math.PI / count * i + 54 / 180 * Math.PI;
                yield [
                    Math.cos( Rradian ) * R,
                    Math.sin( Rradian ) * R
                ]
                yield [
                    Math.cos( rradian ) * r,
                    Math.sin( rradian ) * r
                ]
            }
        }, {
            apply: function(...args){
                const GEN = Reflect.apply( ...args )
                const ANS = [...GEN]
                //console.log( ANS )
                return ANS;
            }
        } )(horm)
        ctx.save()
        ctx.setTransform( ...matrix2D( this.matrix ) )
        //console.log( ctx.getTransform() )
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath()
        for( const p of paths ){
            ctx.lineTo( p[0], p[1] )
        }
        ctx.closePath();
        ctx.fill()
        ctx.restore()
    }

    update(){
        this.matrix[0][3] += this.vx;
        this.matrix[1][3] += this.vy;
        //边界检测
        if( this.matrix[0][3] + this.R >= this.width ){
            this.vx *= -1;
            this.matrix[0][3] = this.width - this.R
        }
        if( this.matrix[0][3] - this.R <= 0 ){
            this.vx *= -1
            this.matrix[0][3] = this.R;
        }
        if( this.matrix[1][3] + this.R >= this.height ){
            this.vy *= -1
            this.matrix[1][3] = this.height - this.R
        }
        if( this.matrix[1][3] - this.R <= 0 ){
            this.vy *= -1
            this.matrix[1][3] = this.R;
        }
        //旋转
        this.diretion > 0 ? this.angel += Math.PI / 180 : this.angel -= Math.PI / 180;
        this.angel %= Math.PI * 2
        this.matrix[0][0] = Math.cos( this.angel )
        this.matrix[0][1] = -Math.sin( this.angel )
        this.matrix[1][0] = Math.sin( this.angel )
        this.matrix[1][1] = Math.cos( this.angel )
        return this;
    }

}

export default class Game{

    private static container:any;
    private static offset:any;

    constructor(domID:string){
        Game.container = document.getElementById( domID )
        Game.offset = Game.container.getBoundingClientRect()
    }

    render(){
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = Game.container.clientWidth;
        const H = canvas.height = Game.container.clientHeight;

        const list = new Proxy( function*(){
            for( let i = 0; i < 25; ++i ){
                const R = getRandom( [6, 10] );
                const ballColor = ctx.createRadialGradient(0, 0, 0, 0, 0, R)
                ballColor.addColorStop( 0, `rgba( ${getRandom([0,255])}, ${getRandom([0,255])}, ${getRandom([0,255])}, 1 )` );
                ballColor.addColorStop( 0.3, `rgba( ${getRandom([0,255])}, ${getRandom([0,255])}, ${getRandom([0,255])}, 1 )` );
                ballColor.addColorStop( 0.5, `rgba( ${getRandom([0,255])}, ${getRandom([0,255])}, ${getRandom([0,255])}, 1 )` );
                ballColor.addColorStop( 0.8, `rgba( ${getRandom([0,255])}, ${getRandom([0,255])}, ${getRandom([0,255])}, 1 )` );
                ballColor.addColorStop( 1, `rgba( ${getRandom([0,255])}, ${getRandom([0,255])}, ${getRandom([0,255])}, 1 )` );
                yield new Ball({
                    matrix: [
                        [0.5, 0, 0, getRandom( [0, W] )],
                        [0, 1, 0, getRandom( [0, H] )],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1],
                    ],
                    width: W,
                    height: H,
                    vx: Math.random() - 0.5,
                    vy: Math.random() - 0.5,
                    fillStyle: ballColor,
                    R,
                    horm: getRandom( [5, 6], true ),
                    diretion: Math.random() > 0.5 ? 1 : -1,
                    angel: getRandom( [0, 2] ) * Math.PI,
                })
            }
        }, { apply: (...args)=>[...Reflect.apply( ...args )] } )() as unknown as any[];



        //分组
        const lists = new Proxy( function*(){
            const result:any[][] = []
            const DFS = function(i:number = 0, temp:any[] = []){
                switch( true ){
                    case temp.length === 2:
                        result.push( temp );
                        break;
                    default:
                        for( let j = i; j < list.length; j++ ) DFS( j+1, [ ...temp, list[j] ] )
                        break;
                }
            }
            DFS()
            for( let i = 0; i < result.length; ++i ) yield result[i];
        }, {apply:(...args)=>[...Reflect.apply(...args)]} )() as unknown as any[][];

        ;( function move(){
            ctx.clearRect( 0, 0, W ,H )
            lists.map( (row)=> impact( row[0], row[1] ) )
            list.map( (row)=> row.update( ctx ) )
            list.map( (row)=> row.draw( ctx ) )
            window.requestAnimationFrame( move )
        } )()

        Game.container.appendChild( canvas )
    }

}