import {
    getAxis,
    matrix3D,
} from "../Common"
import icon from "./static/1696385680872.png"

class ShowOutter{

    private static canvas:any;
    private static ctx:any;
    private static program:any;
    private static vertex_shader:string = `
        precision highp float;
        attribute vec4 v_position;
        attribute vec2 v_TexCoord;
        uniform mat4 matrix;
        varying vec2 f_TexCoord;
        void main(){
            gl_Position = matrix * v_position;
            f_TexCoord = v_TexCoord;
        }
    `
    private static fragment_shader:string = `
        precision highp float;
        varying vec2 f_TexCoord;
        uniform sampler2D f_Sampler;
        
        void main(){
            vec4 texture = texture2D( f_Sampler,  f_TexCoord);
            //float luminance = step( 0.299*texture.r+0.587*texture.g+0.114*texture.b, 0.5 );
            float luminance = 0.299*texture.r+0.587*texture.g+0.114*texture.b;
            gl_FragColor = vec4(luminance, luminance, luminance, 1);
        }
    `
    private static img:any;
    private width:number = 0;
    private height:number = 0;
    private static matrix:number[][] = [ [1, 0, 0, 0], [0, 1, 0,0], [0, 0, 1, 0], [0, 0, 0, 1] ];
    private static angel:number = 0;
    
    //顶点坐标
    private static points = new Float32Array([
        -180, 300,
        180, 300,
        -180, -300,
        180, -300,
    ])

    //图片坐标
    private static texturePos = new Float32Array([
        0, 1,
        1, 1,
        0, 0,
        1, 0,
    ])


    getCanvas(){
        return ShowOutter.canvas;
    }

    constructor(props:any){
        Object.assign( this, props );
        const tcanvas = document.createElement( "canvas" )
        const tctx:any = tcanvas.getContext( "webgl", {
            alpha: true,
        } )
        tcanvas.width = this.width;
        tcanvas.height = this.height;
        tctx.viewport( 0, 0, tcanvas.width, tcanvas.height )
        ShowOutter.canvas = tcanvas;
        ShowOutter.ctx = tctx;
        //初始化矩阵
        ShowOutter.matrix = [
            [2 / tcanvas.width, 0, 0, 0],
            [0, 2 / tcanvas.height, 0, 0],
            [0, 0, -2 / 500, 0],
            [0, 0, 0, 1],
        ]
        //ShowOutter.initMatrix();
        //初始化shader
        ShowOutter.initPrograme()
        const img = new Image()
        img.src = icon;
        img.addEventListener( "load", function(){
            //获取shader变量地址
            const v_position = ShowOutter.ctx.getAttribLocation( ShowOutter.program, "v_position" )
            const v_TexCoord = ShowOutter.ctx.getAttribLocation( ShowOutter.program, "v_TexCoord" )
            const matrix = ShowOutter.ctx.getUniformLocation( ShowOutter.program, "matrix" )
            const f_Sampler = ShowOutter.ctx.getUniformLocation( ShowOutter.program, "f_Sampler" )
            //传递uniform参数
            ShowOutter.ctx.uniformMatrix4fv( matrix, false, matrix3D(ShowOutter.matrix) )

            //创建缓冲区传递attribute参数(顶点)
            const b_point = ShowOutter.ctx.createBuffer()
            ShowOutter.ctx.bindBuffer( ShowOutter.ctx.ARRAY_BUFFER, b_point);
            ShowOutter.ctx.bufferData( ShowOutter.ctx.ARRAY_BUFFER, ShowOutter.points, ShowOutter.ctx.STATIC_DRAW )
            //数据映射规则
            ShowOutter.ctx.vertexAttribPointer( v_position, 2, ShowOutter.ctx.FLOAT, false, 0, 0 )
            //写入数据
            ShowOutter.ctx.enableVertexAttribArray( v_position )

            //创建缓冲区传递attribute参数(顶点)
            const b_texcoord = ShowOutter.ctx.createBuffer()
            ShowOutter.ctx.bindBuffer( ShowOutter.ctx.ARRAY_BUFFER, b_texcoord);
            ShowOutter.ctx.bufferData( ShowOutter.ctx.ARRAY_BUFFER, ShowOutter.texturePos, ShowOutter.ctx.STATIC_DRAW )
            //数据映射规则
            ShowOutter.ctx.vertexAttribPointer( v_TexCoord, 2, ShowOutter.ctx.FLOAT, false, 0, 0 )
            //写入数据
            ShowOutter.ctx.enableVertexAttribArray( v_TexCoord )
            //创建纹理缓冲区
            const b_texture = ShowOutter.ctx.createTexture();
            //纹理图片上下反转
            ShowOutter.ctx.pixelStorei( ShowOutter.ctx.UNPACK_FLIP_Y_WEBGL, true );
            //激活纹理
            ShowOutter.ctx.activeTexture( ShowOutter.ctx.TEXTURE0 )
            //绑定缓冲区
            ShowOutter.ctx.bindTexture( ShowOutter.ctx.TEXTURE_2D, b_texture )
            //纹理设置
            // 纹理坐标水平填充 s
            ShowOutter.ctx.texParameteri(ShowOutter.ctx.TEXTURE_2D, ShowOutter.ctx.TEXTURE_WRAP_S, ShowOutter.ctx.CLAMP_TO_EDGE);
            // 纹理坐标垂直填充 t
            ShowOutter.ctx.texParameteri(ShowOutter.ctx.TEXTURE_2D, ShowOutter.ctx.TEXTURE_WRAP_T, ShowOutter.ctx.CLAMP_TO_EDGE);
            //设置纹理贴图填充方式(纹理贴图像素尺寸大于顶点绘制区域像素尺寸)
            ShowOutter.ctx.texParameteri( ShowOutter.ctx.TEXTURE_2D, ShowOutter.ctx.TEXTURE_MIN_FILTER, ShowOutter.ctx.LINEAR )
            //设置纹理贴图填充方式(纹理贴图像素尺寸小于顶点绘制区域像素尺寸)
            ShowOutter.ctx.texParameteri( ShowOutter.ctx.TEXTURE_2D, ShowOutter.ctx.TEXTURE_MAG_FILTER, ShowOutter.ctx.LINEAR )
            //设置纹理格式
            ShowOutter.ctx.texImage2D( ShowOutter.ctx.TEXTURE_2D, 0, ShowOutter.ctx.RGB, ShowOutter.ctx.RGB, ShowOutter.ctx.UNSIGNED_BYTE, img )
            ShowOutter.ctx.uniform1i( f_Sampler, 0 )
        } )
    
        //初始化参数
        return this;
    }

    private static initPrograme(){
        //创建shader对象
        const vertexShader = ShowOutter.ctx.createShader( ShowOutter.ctx.VERTEX_SHADER )
        const fragmentShader = ShowOutter.ctx.createShader( ShowOutter.ctx.FRAGMENT_SHADER )
        //加载源码
        ShowOutter.ctx.shaderSource( vertexShader, ShowOutter.vertex_shader )
        ShowOutter.ctx.shaderSource( fragmentShader, ShowOutter.fragment_shader )
        //编译程序
        ShowOutter.ctx.compileShader( vertexShader )
        ShowOutter.ctx.compileShader( fragmentShader )
        //创建应用对象
        ShowOutter.program = ShowOutter.ctx.createProgram()
        //激活shader
        ShowOutter.ctx.attachShader( ShowOutter.program, vertexShader )
        ShowOutter.ctx.attachShader( ShowOutter.program, fragmentShader )
        //链接
        ShowOutter.ctx.linkProgram( ShowOutter.program )
        //选择程序
        ShowOutter.ctx.useProgram( ShowOutter.program )
    }

    //初始化矩阵
    private static initMatrix(){
        const angel = 1 / 6 * Math.PI;
        //绕x轴旋转
        const xRotate = [
            [ 1, 0, 0, 0 ],
            [ 0, Math.cos(angel), -Math.sin(angel), 0 ],
            [ 0, Math.sin(angel), Math.cos(angel), 0 ],
            [ 0, 0, 0, 1 ],
        ]
        //绕y轴旋转30度
        const yRotate = [
            [ Math.cos(angel), 0, -Math.sin( angel ), 0 ],
            [ 0, 1, 0, 0 ],
            [ Math.sin(angel), 0, Math.cos(angel), 0 ],
            [ 0, 0, 0, 1 ],
        ]
        //记录状态
        ShowOutter.matrix = getAxis( getAxis( ShowOutter.matrix, yRotate ), xRotate )
        return this;
    }

    //绘制
    draw(){
        //清空画布
        ShowOutter.ctx.clearColor( 0, 0, 0, 0 )
        ShowOutter.ctx.clear( ShowOutter.ctx.COLOR_BUFFER_BIT | ShowOutter.ctx.DEPTH_BUFFER_BIT )
        //开启深度测试, 不使用绘制的先后顺序而使用，Z轴深度
        ShowOutter.ctx.enable( ShowOutter.ctx.DEPTH_TEST )
        //绘制三角形
        ShowOutter.ctx.drawArrays( ShowOutter.ctx.TRIANGLE_STRIP, 0, 4 )
        // let picBuf = new ArrayBuffer(ShowOutter.canvas.width * ShowOutter.canvas.height * 4);
        // let picU8 = new Uint8Array(picBuf);
        // let picU32 = new Uint32Array(picBuf);
        // // // 读取到Uint8Arrays类型数组中
        // ShowOutter.ctx.readPixels(0, 0, ShowOutter.canvas.width, ShowOutter.canvas.height, ShowOutter.ctx.RGBA, ShowOutter.ctx.UNSIGNED_BYTE, picU8);
        //console.log( picU8 )
        return this;
    }
}


export default class GLImage{
    private static container:any;
    private static offset:any;

    constructor(domID:string){
        GLImage.container = document.getElementById( domID )
        GLImage.offset = GLImage.container.getBoundingClientRect()
        return this;
    }

    render(){
        //创建主canvas
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = GLImage.container.clientWidth;
        const H = canvas.height = GLImage.container.clientHeight;

        const doms = new Proxy( function*(){
            yield new ShowOutter({
                width: W, 
                height: H,
            })
        }, {
            apply: (...args)=>[...Reflect.apply(...args)]
        } )() as unknown as any[];


        ;( function move(){
            ctx.clearRect( 0, 0, W, H )
            doms.map( row => row.draw() )
            doms.map( row => ctx.drawImage( row.getCanvas(), 0, 0 ) )
            window.requestAnimationFrame( move )
        } )()

        GLImage.container.appendChild( canvas )

    }
}