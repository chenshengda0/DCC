const path = require( "path" )
const TerserPlugin = require( "terser-webpack-plugin" )
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require( "html-webpack-plugin" )
const CopyWebpackPlugin = require( "copy-webpack-plugin" )

//自定义插件，修改版本
class ChangeVersion{
    async apply(compiler){
        await new Promise( (resolve, reject)=>{
            fs.readFile( "./dist/package.json", "utf8", ( err, data )=>{
                if(err) reject(err)
                const param = JSON.parse( data )
                const versions = param.version.split(".")
                versions.push( String( parseInt( versions.pop() ) + 1 ) )
                param.version = versions.join(".")  
                resolve( JSON.stringify( param ) )
            } )
        } ).then( (res)=>{
            new Promise( (resolve, reject) => {
                fs.writeFile( "./dist/package.json", res, (err) => err && reject( err ) )
            } )
        } )
        console.log( "ChangeVersion 启动" )
    }
}

module.exports = {
    entry: {
        index: "./src/test.ts",
    },
    resolve: {
        extensions: [".js", ".json", ".ts"],
    },
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    output:{
        filename: "[name].js",
        environment: {
            arrowFunction: false,
        },
        path: path.resolve( __dirname, "./devDist" )
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    devServer:{
        static: "devDist",
        open: false,
        compress: true,
        host: "127.0.0.1",
        hot: true,
        port: 8000,
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: false, //不将注释提取到单独的文件中
        })]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/gi,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        "targets": {
                                            "chrome": "58",
                                            "ie": "11",
                                        },
                                        "corejs": "3",
                                        "useBuiltIns": "usage",
                                    }
                                ]
                            ]
                        }
                    },
                    {
                        loader: "ts-loader",
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./public/"), 
                    globOptions: {
                        ignore: [
                          // Ignore all `txt` files
                          '**/*.ejs',
                        ],
                    },
                    to: "./",
                },
            ]
        }),
        //首页
        new HtmlWebpackPlugin({
            title: "首页",
            template: "./public/template.ejs",
            filename: "index.html",
            chunks: ["index"],
        }),
        //清除文件
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!favicon.ico', '!index.html', '!logo.png']
        }),
    ]
}