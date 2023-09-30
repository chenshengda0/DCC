### WEBPACK 打包 IIFE（默认通过script导入文件并自动执行）
```
    output:{
        filename: "[name].js",
        environment: {
            arrowFunction: false, //默认的箭头函数修改为ES5函数
        },
        path: path.resolve( __dirname, "./devDist" ),
    },
```

### WEBPACK 打包 ES MODULE
```
    experiments: {
        outputModule: true
    },
    output:{
        filename: "[name].js",
        path: path.resolve( __dirname, "./dist" ),
        library: {
            type: 'module'
        },
    },
```

### tree shaking
```
    1. tree shaking 意思是摇树，打包时移除未使用的模块
    2. mode = production 时，默认开启tree shaking
    3. tree shaking 判断标准除了文件中使用模块之外，另外判断sideEffects( 是否有副作用 )，在package.json中配置，ESM中配置为有副作用打包时则会加载所有文件，否则打包后的源代码会被webpack删除
    4. "sideEffects": ["./src/**/*"] 设置src目录中文件都有副作用
```

### 安装 npm
```
    yarn add dream_canvas
```
