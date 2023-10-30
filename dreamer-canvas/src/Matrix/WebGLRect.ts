import {
    invert,
    getAxis,
    getRandom,
    getAve,
    matrix3D,
    perspectiveNO,
} from "../Common"

class ShowImage{
    private static vertexString = `
        //逐顶点位置
        attribute vec4 a_position;
        //逐顶点颜色
        attribute vec4 a_color;
        //逐顶点法向量
        attribute vec4 a_normal;
        //矩阵
        uniform mat4 proj;
        //传递给片源着色器
        varying vec4 v_color;

        void main(){
            gl_Position = proj * a_position;
            //gl_PointSize = 5.0;
            //光源颜色
            vec3 u_lightColor = vec3(1, 1, 1);
            //光源位置
            vec3 u_lightPosition = normalize( vec3(0, 0, 1) );
            //逐顶点法向量矩阵变换
            vec3 normal = normalize( (proj * a_normal).xyz );
            //点光源向量
            vec3 lightDirection = normalize( vec3(gl_Position) - u_lightPosition );
            //与法向量余弦值
            float dot = max( dot(lightDirection, normal), 0.0 );
            //计算颜色
            vec3 reflectedLight = u_lightColor * a_color.rgb * dot;
            //三维向量转4维向量
            v_color = vec4(reflectedLight, a_color.a);
        }
    `

    private static fragmentString = `
        // 所有float类型数据的精度是lowp
        precision lowp float;
        // 接收顶点着色器中v_color数据
        varying vec4 v_color;
        void main(){
            gl_FragColor = v_color; //vec4( 1, 1, 1, 1 );
        }
    `
    private static localPoints:number[] = [
        50, 50, -100, 1,
        1, 0, 0, 1,

        50, -50, -100, 1,
        1, 0, 0, 1,

        -50, -50, -100, 1,
        1, 0, 0, 1,

        -50, 50, -100, 1,
        1, 0, 0, 1,

        50, 50, -200, 1,
        1, 0, 0, 1,

        50, -50, -200, 1,
        1, 0, 0, 1,

        -50, -50, -200, 1,
        1, 0, 0, 1,

        -50, 50, -200, 1,
        1, 0, 0, 1,
    ]
    private static localIndex:number[] = [
        0, 1, 2, 3,
        4, 5, 6, 7,

        0, 1, 5, 4,
        3, 2, 6, 7,

        1, 2, 6, 5,
        0, 3, 7, 4,
    ]

    private static normalData = new Float32Array([
        
        0,0,1, 0,0,1, 0,0,1, 0,0,1, // z轴
        0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, //z轴负方向

        1,0,0, 1,0,0, 1,0,0, 1,0,0, // x轴
        -1,0,0, -1,0,0, -1,0,0, -1,0,0, //x轴负方向

        0,1,0, 0,1,0, 0,1,0, 0,1,0, // y轴
        0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, //y轴负方向
    ])

    private static canvas:any;
    private static ctx:any
    private static program:any;

    private width:number = 0;
    private height:number = 0;

    private matrix:number[][] = [ [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1] ]
    
    private static  angel:number = 0

    constructor(props:any){
        Object.assign( this, props )
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "webgl" )
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.viewport( 0, 0, canvas.width, canvas.height)
        ShowImage.ctx = ctx;
        ShowImage.canvas = canvas;
        //编译shader
        ShowImage.compile()
        //初始化参数
        this.initParam()
        return this;
    }

    getCanvas(){
        return ShowImage.canvas;
    }

    
    private static compile(){
        const vsshader = ShowImage.ctx.createShader( ShowImage.ctx.VERTEX_SHADER )
        const fssagder = ShowImage.ctx.createShader( ShowImage.ctx.FRAGMENT_SHADER )
        ShowImage.ctx.shaderSource( vsshader, ShowImage.vertexString )
        ShowImage.ctx.shaderSource( fssagder, ShowImage.fragmentString )
        ShowImage.ctx.compileShader( vsshader )
        ShowImage.ctx.compileShader( fssagder )
        const program = ShowImage.ctx.createProgram();
        ShowImage.ctx.attachShader( program, vsshader )
        ShowImage.ctx.attachShader( program, fssagder )
        ShowImage.ctx.linkProgram( program )
        ShowImage.ctx.useProgram( program )
        ShowImage.program = program;
    }

    private initParam(){
        //定义参数
        const aPosition = ShowImage.ctx.getAttribLocation( ShowImage.program, "a_position" )
        const uniforproj = ShowImage.ctx.getUniformLocation( ShowImage.program, "proj" )
        const vist = ShowImage.ctx.getUniformLocation( ShowImage.program, "vist" )
        const a_color = ShowImage.ctx.getAttribLocation( ShowImage.program, "a_color" )
        const a_normal = ShowImage.ctx.getAttribLocation( ShowImage.program, "a_normal" )
        ShowImage.ctx.uniformMatrix4fv(uniforproj, false, matrix3D( this.matrix ));
        ShowImage.ctx.uniformMatrix4fv(vist, false, matrix3D( this.matrix ));
        //索引缓冲区
        const indexPosition = new Uint8Array( ShowImage.localIndex )
        const indexBuffer = ShowImage.ctx.createBuffer();
        ShowImage.ctx.bindBuffer( ShowImage.ctx.ELEMENT_ARRAY_BUFFER, indexBuffer )
        ShowImage.ctx.bufferData( ShowImage.ctx.ELEMENT_ARRAY_BUFFER, indexPosition, ShowImage.ctx.STATIC_DRAW )
        /*
        //颜色插值
        const colorPosition = new Float32Array( ShowImage.localColor )
        const collorBuffer = ShowImage.ctx.createBuffer()
        ShowImage.ctx.bindBuffer( ShowImage.ctx.ARRAY_BUFFER, collorBuffer ) 
        ShowImage.ctx.bufferData( ShowImage.ctx.ARRAY_BUFFER, colorPosition, ShowImage.ctx.STATIC_DRAW )
        ShowImage.ctx.vertexAttribPointer( a_color, 3, ShowImage.ctx.FLOAT, false, 0, 0 )
        ShowImage.ctx.enableVertexAttribArray( a_color )
        */
        //法向量缓冲区
        const normalBuffer = ShowImage.ctx.createBuffer();
        ShowImage.ctx.bindBuffer( ShowImage.ctx.ARRAY_BUFFER, normalBuffer )
        ShowImage.ctx.bufferData( ShowImage.ctx.ARRAY_BUFFER, ShowImage.normalData, ShowImage.ctx.STATIC_DRAW )
        ShowImage.ctx.vertexAttribPointer( a_normal, 3, ShowImage.ctx.FLOAT, false, 0, 0 )
        ShowImage.ctx.enableVertexAttribArray( a_normal )
        //数据缓冲区
        const pointPosition = new Float32Array( ShowImage.localPoints )
        const pointBuffer = ShowImage.ctx.createBuffer()
        ShowImage.ctx.bindBuffer( ShowImage.ctx.ARRAY_BUFFER, pointBuffer )
        ShowImage.ctx.bufferData( ShowImage.ctx.ARRAY_BUFFER, pointPosition, ShowImage.ctx.STATIC_DRAW )
        ShowImage.ctx.vertexAttribPointer( aPosition, 4, ShowImage.ctx.FLOAT, false, 4*8, 0 )
        ShowImage.ctx.vertexAttribPointer( a_color, 4, ShowImage.ctx.FLOAT, false, 4*8, 4*4 )
        ShowImage.ctx.enableVertexAttribArray( aPosition )
        ShowImage.ctx.enableVertexAttribArray( a_color )
    }

    draw(){
        ShowImage.ctx.clearColor( 0, 0, 0, 0 )
        ShowImage.ctx.clear( ShowImage.ctx.COLOR_BUFFER_BIT | ShowImage.ctx.DEPTH_BUFFER_BIT )
        ShowImage.ctx.enable( ShowImage.ctx.DEPTH_TEST )
        ShowImage.ctx.drawElements( ShowImage.ctx.TRIANGLE_FAN, 4, ShowImage.ctx.UNSIGNED_BYTE, 0 )
        ShowImage.ctx.drawElements( ShowImage.ctx.TRIANGLE_FAN, 4, ShowImage.ctx.UNSIGNED_BYTE, 4 )
        ShowImage.ctx.drawElements( ShowImage.ctx.TRIANGLE_FAN, 4, ShowImage.ctx.UNSIGNED_BYTE, 8 )
        ShowImage.ctx.drawElements( ShowImage.ctx.TRIANGLE_FAN, 4, ShowImage.ctx.UNSIGNED_BYTE, 12 )
        ShowImage.ctx.drawElements( ShowImage.ctx.TRIANGLE_FAN, 4, ShowImage.ctx.UNSIGNED_BYTE, 16 )
        ShowImage.ctx.drawElements( ShowImage.ctx.TRIANGLE_FAN, 4, ShowImage.ctx.UNSIGNED_BYTE, 20 )
    }

    //更新矩阵
    update(){
        ShowImage.angel += Math.PI / 180
        ShowImage.angel %= 2 * Math.PI
        const matrix = getAxis( this.matrix, [
            [1, 0, 0, 0],
            [0, Math.cos(ShowImage.angel), -Math.sin(ShowImage.angel), 0],
            [0, Math.sin(ShowImage.angel), Math.cos(ShowImage.angel), 0],
            [0, 0, 0, 1],
        ] )
        const uniforproj = ShowImage.ctx.getUniformLocation( ShowImage.program, "proj" )
        ShowImage.ctx.uniformMatrix4fv(uniforproj, false, matrix3D( matrix ));
    }

}

export default  class WebGLRect{
    private static container:any;
    private static offset:any;



    constructor(domID:string){
        WebGLRect.container = document.getElementById( domID )
        WebGLRect.offset = WebGLRect.container.getBoundingClientRect()
    }

    render(){
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = WebGLRect.container.clientWidth;
        const H = canvas.height = WebGLRect.container.clientHeight;
        const matrix:number[][] = [
            [2/W, 0, 0, 0],
            [0, -2/H, 0, 0],
            [0, 0, 2/600, 0],
            [0, 0, 0, 1],
        ]
        const wCanvas = new ShowImage({
            width: W,
            height: H,
            matrix:  getAxis( getAxis( matrix, [
                [1, 0, 0, 0],
                [0, Math.cos(1/6*Math.PI), -Math.sin(1/6*Math.PI), 0],
                [0, Math.sin(1/6*Math.PI), Math.cos(1/6*Math.PI), 0],
                [0, 0, 0, 1],
            ] ), [
                [Math.cos(1/6*Math.PI), 0, -Math.sin(1/6*Math.PI), 0],
                [0, 1, 0, 0],
                [Math.sin(1/6*Math.PI), 0,Math.cos(1/6*Math.PI), 0],
                [0, 0, 0, 1],
            ] )
        })



        ;( function move(){
            ctx.clearRect( 0, 0, W ,H )
            wCanvas.update()
            wCanvas.draw()
            ctx.drawImage( wCanvas.getCanvas(), 0 ,0  )
            window.requestAnimationFrame( move )
        } )()
        
        WebGLRect.container.appendChild( canvas )
    }

}