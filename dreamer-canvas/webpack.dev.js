const common = require( "./webpack.common" )
const {merge} = require( "webpack-merge" )
const path = require( "path" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" )
const CopyWebpackPlugin = require( "copy-webpack-plugin" )
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

module.exports = merge(
    common,
    {
        entry: {
            index: "./src/test.ts",
        },
        output:{
            filename: "[name].js",
            environment: {
                arrowFunction: false,
            },
            path: path.resolve( __dirname, "./devDist" ),
        },
        mode: "development",
        devtool: "eval-cheap-module-source-map",
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
            // new CleanWebpackPlugin({
            //     cleanOnceBeforeBuildPatterns: ['**/*', '!favicon.ico', '!logo.png' ]
            // }),
        ]
    }
);