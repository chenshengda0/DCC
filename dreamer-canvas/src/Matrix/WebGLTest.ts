import {
    getAxis,
    matrix3D,
    perspectiveNO,
} from "../Common"

class ShowImage{

    private static canvas:any;
    private static ctx:any;
    private static program:any;
    private static vertexString = `
        precision highp float;
        attribute vec4 v_position;
        attribute vec4 v_color;
        uniform mat4 v_matrix;
        varying vec4 f_color;
        void main(){
            vec4 position =v_matrix * v_position;
            gl_Position = position;
            f_color = v_color;
        }
    `
    private static fragmentString = `
        precision highp float;
        varying vec4 f_color;
        void main(){
            gl_FragColor = f_color;
        }
    `

    private matrix:number[][] = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ]

    private width:number = 0;
    private height:number = 0;
    private static angel = 0;

    constructor(props:any){
        Object.assign( this, props )
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "webgl" )
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.viewport( 0, 0, canvas.width, canvas.height )
        ShowImage.canvas = canvas;
        ShowImage.ctx = ctx;
        ShowImage.initProgram();
        this.initParam();
        return this;
    }

    getCanvas(){
        return ShowImage.canvas;
    }

    private static initProgram(){
        //创建程序
        const vertexShader = ShowImage.ctx.createShader( ShowImage.ctx.VERTEX_SHADER )
        const fragramShader = ShowImage.ctx.createShader( ShowImage.ctx.FRAGMENT_SHADER )
        //绑定源码
        ShowImage.ctx.shaderSource( vertexShader, ShowImage.vertexString )
        ShowImage.ctx.shaderSource( fragramShader, ShowImage.fragmentString )
        //编译程序
        ShowImage.ctx.compileShader( vertexShader )
        ShowImage.ctx.compileShader( fragramShader )
        //创建js中的程序对象
        ShowImage.program = ShowImage.ctx.createProgram()
        ShowImage.ctx.attachShader( ShowImage.program, vertexShader )
        ShowImage.ctx.attachShader( ShowImage.program, fragramShader )
        //链接
        ShowImage.ctx.linkProgram( ShowImage.program )
        //激活程序
        ShowImage.ctx.useProgram( ShowImage.program )
        return this;
    }

    private initParam(){
        
        const v_position = ShowImage.ctx.getAttribLocation( ShowImage.program, "v_position" )
        const v_color = ShowImage.ctx.getAttribLocation( ShowImage.program, "v_color" )
        const v_matrix = ShowImage.ctx.getUniformLocation( ShowImage.program, "v_matrix" )
        ShowImage.ctx.uniformMatrix4fv( v_matrix, false, matrix3D( this.matrix ) )
        //创建缓冲区
        const points = new Float32Array( [
            //前
            0.1, 0.1, -0.1, 1,
            1, 0, 0, 1,
            0.1, -0.1, -0.1, 1,
            1, 0, 0, 1,
            -0.1, -0.1, -0.1, 1,
            1, 0, 0, 1,
            -0.1, 0.1, -0.1, 1,
            1, 0, 0, 1,

            //后
            0.1, 0.1, -0.3, 1,
            0, 1, 0, 1,
            0.1, -0.1, -0.3, 1,
            0, 1, 0, 1,
            -0.1, -0.1, -0.3, 1,
            0, 1, 0, 1,
            -0.1, 0.1, -0.3, 1,
            0, 1, 0, 1,

            //下
            0.1, -0.1, -0.1, 1,
            0, 0, 1, 1,
            -0.1, -0.1, -0.1, 1,
            0, 0, 1, 1,
            -0.1, -0.1, -0.3, 1,
            0, 0, 1, 1,
            0.1, -0.1, -0.3, 1,
            0, 0, 1, 1,

            //左
            -0.1, 0.1, -0.1, 1,
            1, 1, 0, 1,
            -0.1, -0.1, -0.1, 1,
            1, 1, 0, 1,
            -0.1, -0.1, -0.3, 1,
            1, 1, 0, 1,
            -0.1, 0.1, -0.3, 1,
            1, 1, 0, 1,

            //右
            0.1, -0.1, -0.1, 1,
            1, 0, 1, 1,
            0.1, 0.1, -0.1, 1,
            1, 0, 1, 1, 
            0.1, 0.1, -0.3, 1,
            1, 0, 1, 1,
            0.1, -0.1, -0.3, 1,
            1, 0, 1, 1,

            //上
            -0.1, 0.1, -0.1, 1,
            0, 1, 1, 1, 
            0.1, 0.1, -0.1, 1,
            0, 1, 1, 1,
            0.1, 0.1, -0.3, 1,
            0, 1, 1, 1,
            -0.1, 0.1, -0.3, 1,
            0, 1, 1, 1,
        ] )
        const positionBuffer = ShowImage.ctx.createBuffer()
        //绑定缓冲区
        ShowImage.ctx.bindBuffer( ShowImage.ctx.ARRAY_BUFFER, positionBuffer )
        //写入数据
        ShowImage.ctx.bufferData( ShowImage.ctx.ARRAY_BUFFER, points, ShowImage.ctx.STATIC_DRAW )
        //传入数据
        ShowImage.ctx.vertexAttribPointer( v_position, 4, ShowImage.ctx.FLOAT, false, 8*4, 0 )
        ShowImage.ctx.vertexAttribPointer( v_color, 4, ShowImage.ctx.FLOAT, false, 8*4, 4*4 )
        //激活缓冲区
        ShowImage.ctx.enableVertexAttribArray( v_position )
        ShowImage.ctx.enableVertexAttribArray( v_color )
        return this;
    }

    draw(){

        ShowImage.ctx.clearColor( 0, 0, 0, 0 )
        ShowImage.ctx.clear( ShowImage.ctx.COLOR_BUFFER_BIT | ShowImage.ctx.DEPTH_BUFFER_BIT )
        ShowImage.ctx.enable( ShowImage.ctx.DEPTH_TEST )
        ShowImage.ctx.drawArrays( ShowImage.ctx.TRIANGLE_FAN, 0, 4 )
        ShowImage.ctx.drawArrays( ShowImage.ctx.TRIANGLE_FAN, 4, 4 )
        ShowImage.ctx.drawArrays( ShowImage.ctx.TRIANGLE_FAN, 8, 4 )
        ShowImage.ctx.drawArrays( ShowImage.ctx.TRIANGLE_FAN, 12, 4 )
        ShowImage.ctx.drawArrays( ShowImage.ctx.TRIANGLE_FAN, 16, 4 )
        ShowImage.ctx.drawArrays( ShowImage.ctx.TRIANGLE_FAN, 20, 4 )
        return this;
    }

    update(){
        ShowImage.angel += Math.PI / 180
        ShowImage.angel %= 2 * Math.PI
        const matrix = getAxis( this.matrix, [
            [ Math.cos( ShowImage.angel ), -Math.sin( ShowImage.angel ), 0, 0 ],
            [ Math.sin( ShowImage.angel ),  Math.cos( ShowImage.angel ), 0, 0 ],
            [ 0, 0, 1, 0 ],
            [ 0, 0, 0, 1 ],
        ] )
        const v_matrix = ShowImage.ctx.getUniformLocation( ShowImage.program, "v_matrix" )
        ShowImage.ctx.uniformMatrix4fv( v_matrix, false, matrix3D( matrix ) )
    }
}

export default class WebGLTest{

    private static container:any;
    private static offset:any;

    constructor(domID:string){
        WebGLTest.container = document.getElementById( domID )
        WebGLTest.offset = WebGLTest.container.getBoundingClientRect()
    }

    render(){
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = WebGLTest.container.clientWidth;
        const H = canvas.height = WebGLTest.container.clientHeight;
        const matrix = perspectiveNO( Math.PI * 2 / 3, W / H, 0.11, 1)

        const show = new ShowImage({
            width: W,
            height: H,
            matrix,
        })

        ;( function move(){
            ctx.clearRect( 0, 0, W, H )
            show.update()
            show.draw()
            ctx.drawImage( show.getCanvas(), 0, 0 )
            window.requestAnimationFrame( move )
        } )()

        WebGLTest.container.appendChild( canvas )
    }

}