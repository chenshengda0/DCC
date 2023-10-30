import {
    getAxis,
    adjoint,
    invert,
    determinant,
    perspectiveNO,
    matrix3D,
} from "../Common"

class ShowImage{
    private static canvas:any;
    private static ctx:any;
    private static program:any;

    private static vertexString = `
        precision highp float;
        attribute vec4 v_position;
        uniform mat4 v_matrix;
        uniform vec4 v_color;
        varying vec4 f_color;
        void main(){
            gl_Position = v_matrix * v_position;
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

    private width:number = 0;
    private height:number = 0;
    private d_matrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ]

    private d_points:number[] = []
    private d_color = [0, 0, 0, 1];

    constructor(props:any){
        Object.assign(this, props);
        ShowImage.canvas = document.createElement( "canvas" )
        ShowImage.ctx = ShowImage.canvas.getContext( "webgl" )
        ShowImage.canvas.width = this.width;
        ShowImage.canvas.height = this.height;
        ShowImage.ctx.viewport( 0, 0, this.width, this.height )
        //加载程序
        const vertexShader = ShowImage.ctx.createShader( ShowImage.ctx.VERTEX_SHADER )
        const fragmentShader = ShowImage.ctx.createShader( ShowImage.ctx.FRAGMENT_SHADER )
        ShowImage.ctx.shaderSource( vertexShader, ShowImage.vertexString )
        ShowImage.ctx.shaderSource( fragmentShader, ShowImage.fragmentString )
        ShowImage.ctx.compileShader( vertexShader )
        ShowImage.ctx.compileShader( fragmentShader )
        ShowImage.program = ShowImage.ctx.createProgram()
        ShowImage.ctx.attachShader( ShowImage.program, vertexShader )
        ShowImage.ctx.attachShader( ShowImage.program, fragmentShader )
        ShowImage.ctx.linkProgram( ShowImage.program )
        ShowImage.ctx.useProgram( ShowImage.program )
        return this;
    }

    getCanvas(){
        return ShowImage.canvas;
    }

    draw(){
        ShowImage.ctx.clearColor( 0, 0, 0, 0 )
        ShowImage.ctx.clear( ShowImage.ctx.COLOR_BUFFER_BIT | ShowImage.ctx.DEPTH_BUFFER_BIT )
        ShowImage.ctx.enable( ShowImage.ctx.DEPTH_TEST )
        const d_points = new Float32Array(this.d_points);
        const v_matrix = ShowImage.ctx.getUniformLocation( ShowImage.program, "v_matrix" )
        const v_position = ShowImage.ctx.getAttribLocation( ShowImage.program, "v_position" )
        const v_color = ShowImage.ctx.getUniformLocation( ShowImage.program, "v_color" )
        //设置矩阵
        ShowImage.ctx.uniformMatrix4fv( v_matrix, false, matrix3D( this.d_matrix ) )
        //设置颜色
        ShowImage.ctx.uniform4f( v_color, ...this.d_color )
        //初始化buffer
        const s_buffer = ShowImage.ctx.createBuffer();
        ShowImage.ctx.bindBuffer( ShowImage.ctx.ARRAY_BUFFER, s_buffer )
        ShowImage.ctx.bufferData( ShowImage.ctx.ARRAY_BUFFER, d_points, ShowImage.ctx.STATIC_DRAW )
        ShowImage.ctx.vertexAttribPointer( v_position, 4, ShowImage.ctx.FLOAT, false, 0, 0 ) 
        ShowImage.ctx.enableVertexAttribArray( v_position ) 
        
        ShowImage.ctx.drawArrays( ShowImage.ctx.TRIANGLES, 0, 3 )
        return this;
    }
}

export default class Matrix{
    private static container:any;
    private static offset:any;

    constructor(domID:string){
        Matrix.container = document.getElementById( domID )
        Matrix.offset = Matrix.container.getBoundingClientRect()
    }

    render(){
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = Matrix.container.clientWidth;
        const H = canvas.height = Matrix.container.clientHeight;

        console.log( perspectiveNO( Math.PI, W / H, 0.01, 1 ) )

        const doms = new Proxy( function*(){
            yield new ShowImage({
                width: W,
                height: H,
                d_matrix: getAxis( perspectiveNO( Math.PI * 2 / 3, W / H, 0.1, 1 ), [
                    [1, 0, 0, 0.2],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ] ),
                d_points: [
                    0, 0.5, -0.3, 1,
                    -0.1, 0, -0.3 ,1,
                    0.1, 0, -0.3, 1,
                ],
                d_color: [1, 0, 0, 1],
            });
            yield new ShowImage({
                width: W,
                height: H,
                d_matrix: getAxis( perspectiveNO( Math.PI * 2 / 3, W / H, 0.1, 1 ), [
                    [1, 0, 0, 0.2],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ] ),
                d_points: [
                    0, 0.5, -0.5, 1,
                    -0.1, 0, -0.5 ,1,
                    0.1, 0, -0.5, 1,
                ],
                d_color: [1, 1, 0, 1],
            })
            yield new ShowImage({
                width: W,
                height: H,
                d_matrix: getAxis( perspectiveNO( Math.PI * 2 / 3, W / H, 0.1, 1 ), [
                    [1, 0, 0, 0.2],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ] ),
                d_points: [
                    0, 0.5, -0.8, 1,
                    -0.1, 0, -0.8 ,1,
                    0.1, 0, -0.8, 1,
                ],
                d_color: [0, 1, 1, 1],
            })
        }, {apply: (...args)=>[...Reflect.apply(...args)]} )() as unknown as any[];

        ;( function move(){
            ctx.clearRect( 0, 0, W, H )
            doms.map( (row) => {
                row.draw();
                ctx.drawImage( row.getCanvas(), 0, 0 )
            } )
            window.requestAnimationFrame( move )
        } )()

        Matrix.container.appendChild( canvas )
    }
}