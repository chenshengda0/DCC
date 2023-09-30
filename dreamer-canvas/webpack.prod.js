const common = require( "./webpack.common" )
const {merge} = require( "webpack-merge" )
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const path = require( "path" )
const fs = require("fs");

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
        console.log( "~自定义ChangeVersion插件~" )
    }
}

module.exports = merge(
    common,
    {
        entry: {
            index: "./src/index.ts",
        },
        mode: "production",
        devtool: false,
        experiments: {
            outputModule: true
        },
        output:{
            filename: "[name].js",
            // environment: {
            //     arrowFunction: false,
            // },
            path: path.resolve( __dirname, "./dist" ),
            library: {
                type: 'module'
            },
        },
        plugins: [
            //修改版本号
            new ChangeVersion(),
            //清除文件
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['**/*', '!package.json', '!README.md' ]
            }),
        ]
    }
);