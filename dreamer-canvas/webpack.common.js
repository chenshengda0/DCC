const TerserPlugin = require( "terser-webpack-plugin" )

module.exports = {

    resolve: {
        extensions: [".js", ".json", ".ts"],
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
                                    "@babel/preset-env",//指定环境插件
                                    {//配置信息
                                        "targets":{
                                            "chrome": "58",
                                            "ie": "11"
                                        },
                                        "corejs":"3",
                                        "useBuiltIns": "usage"
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
}