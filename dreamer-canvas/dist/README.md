## 通用类型

```
export default class Parent {
    private static container;
    private static offset;
    constructor(domID: string);
    render(r?: number, fillStyle?: string): void;
}
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
