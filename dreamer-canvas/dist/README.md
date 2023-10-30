## 通用类型

```
export default class Parent {
    private static container;
    private static offset;
    constructor(domID: string);
    render(r?: number, fillStyle?: string): void;
}
```

## 全局方法
```
    // promise 延时器
    export declare const sleep: (wait?: number) => Promise<unknown>;
    
    //方法装饰器
    export declare const runtimeDecorator: () => MethodDecorator;

    //生成范围内随机数，可以指定是否生成int类型
    export declare const getRandom: (arr: number[], isInt?: boolean) => number;

    //矩阵乘法( !!!isPoint参数区分向量与矩阵，为了保持与内置矩阵一致，向量统一表示为[ [x, y, z, w] ], 矩阵则表示为[[1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,1]]， 差别是 转置 T(point) )
    export declare const getAxis: (left: number[][], right?: number[][], isPoint?: boolean) => number[][];
    
    //返回 css3 矩阵字符串 
    export declare const matrix3D: (source: number[][]) => string;

    //返回 canvas setTransform参数数组，另外 setTransform 与 css3 matrix参数一致
    export declare const matrix2D: (source: number[][]) => number[];

    //计算数组平均值与和
    export declare const getAve: (source: number[]) => {
        source: number[];
        count: number;
        sum: number;
        ave: number;
    };

    //计算rgba灰度值
    export declare const getGray: (rgba: number[]) => number;

    //求(3*3, 4*4)逆矩阵( 借鉴 https://github.com/mrdoob/three.js.git )
    export declare const invert: (source: number[][]) => number[][];

    //圆球碰撞检测(2d 旋转)
    export declare const impact: (b0: any, b1: any) => void;

    //自定义计算矩阵行列式
    export declare const determinant: (source: number[][]) => number;
    
    //自定义计算伴随矩阵 A<sup>-1</sup>A<sup>*</sup> = ｜A｜ (逆矩阵 = 伴随矩阵 / 矩阵行列式) 类似使用导数求除法
    export declare const adjoint: (source: number[][]) => number[][];

    //透视矩阵
    export declare function perspectiveNO(fovy: number, aspect: number, near: number, far: number): number[][];
```


## 全局事件
```
    //获取处理后的图片
    window.addEventListener( "dream_canvas_save_img", function(e){
        console.log( "图片src: ", e )
    } )

    //获取颜色
    window.addEventListener( "dream_canvas_show_color", function(e){
        console.log( "显示颜色: ", e )
    } )
```

## canvas 2D

### 拖拽( MoveBall )

```
    new MoveBall( "canvas" ).render()
```

### 获取字体轮廓动画( Hollow )

```
    new Hollow( "canvas" ).render()
```

### 取色器( ColorPicker )

```
    new ColorPicker( "canvas" ).render()
```

### 单色图( Monochrome )
```
    new Monochrome( "canvas" ).render()
```

### 负片( Negative )
```
    new Negative( "canvas" ).render()
```

### 灰度图( Grayscale )
```
    new Grayscale( "canvas" ).render()
```

### 二值化( Binarization )
```
    new Binarization( "canvas" ).render()
```

### 图片裁剪( Clip )
```
    new Clip( "canvas" ).render()
```

### 图片加解密( Encryption )
```
    new Encryption( "canvas" ).render()
```

### GIF解析成雪碧图
```
    new ParseGif( "canvas" ).render()
```

### 签名板( Writing )
```
    new Writing( "canvas" ).render()
```

### 图片缩放
```
    new Scale( "canvas" ).render()
```

### dom转png
```
    new Html2Png( "canvas" ).render( "targetDomID" )
```

### z轴远离或趋近消失点的3D动画( D3Ball )
```
    new D3Ball( "canvas" ).render()
```

### 绕x轴旋转的3D动画( D3Scale )
```
    new D3Scale( "canvas" ).render()
```

### 使用4*4矩阵实现3D动画( MatrixMove )
```
    new MatrixMove( "canvas" ).render()
```

### 使用内置矩阵实现图片2D错切( MatrixImage )
```
    new MatrixImage( "canvas" ).render( -5 )
```

### 动态背景( Game )
```
    new Game( "canvas" ).render()
```

### 背景无限循环（ GameBG ）
```
    new GameBG( "canvas" ),render()
```


### 可交互动画( GameMove )
```
    new GameMove( "canvas" ).render()
```

### 帧动画(Animation)
```
    new Animation( "canvas" ).render()
```

### 3D动画( 绕x、y、z轴旋转 )
```
    new D3( "canvas" ).render()
```

## webGL

### 立方体旋转动画( WebGLRect(点光源) )
```
    new WebGLRect("canvas").render()
```

### 图片纹理( GLImage )
```
    new GLImage("canvas").render()
```


### 透视图( WebGLTest )
```
    new WebGLTest("canvas").render()
```





