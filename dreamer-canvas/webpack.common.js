const TerserPlugin = require( "terser-webpack-plugin" )
const webpack = require( "webpack" )

module.exports = {

    resolve: {
        extensions: [".js", ".json", ".ts"],
    },
    performance:{
        hints: false,
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
            },

            {
                test: /\.(png)|(jpg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 30 * 1024 * 1024,
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            ENR: JSON.stringify( [245,228,192,135,193,63,160,27,161,141,227,95,235,99,234,6,64,34,151,67,5,128,73,178,138,237,45,174,69,82,93,75,70,80,187,86,87,76,56,240,29,155,170,218,148,190,249,183,37,68,181,26,241,239,202,209,203,188,94,195,168,13,72,126,129,62,96,39,136,150,162,179,250,220,217,36,207,12,236,165,15,78,186,3,117,204,139,0,159,28,252,7,22,44,89,152,1,77,38,184,185,65,231,208,104,233,171,18,189,167,196,216,172,157,142,2,221,163,106,81,232,83,147,254,97,66,158,33,230,4,200,211,214,134,121,246,84,210,71,88,17,164,91,111,52,146,103,213,58,24,120,98,243,226,110,35,30,90,14,244,191,85,175,251,79,74,48,238,92,130,173,113,125,118,21,219,149,131,40,19,108,140,132,154,222,177,46,101,25,255,119,144,11,122,169,107,105,123,145,49,176,153,114,112,100,143,59,102,124,57,115,127,198,248,253,60,50,180,109,116,43,55,225,32,41,166,61,247,42,47,8,206,54,182,199,205,137,53,133,194,51,31,10,20,16,212,23,224,229,215,201,197,223,242,156,9] ),
            ENG: JSON.stringify( [134,176,59,57,124,90,11,253,226,74,52,0,183,133,195,255,146,8,174,80,51,148,76,212,234,84,218,113,224,64,111,228,130,6,128,37,27,135,32,202,131,40,31,140,155,46,105,71,187,101,23,203,192,141,26,209,154,65,115,232,41,29,4,199,166,129,208,211,70,93,49,142,83,252,239,85,249,198,9,162,82,171,213,227,56,147,163,235,102,164,240,44,190,7,87,220,144,75,217,78,10,161,92,233,204,177,132,108,62,58,119,66,179,215,170,60,33,216,16,185,21,63,15,45,230,17,122,191,223,79,250,86,38,94,175,243,22,77,188,35,238,36,68,168,72,181,165,159,2,173,109,136,81,118,125,214,207,43,69,229,48,172,241,184,225,200,126,89,103,137,19,14,149,139,221,98,13,244,150,110,193,145,160,34,186,28,222,158,201,219,245,117,99,96,143,127,251,50,47,106,53,123,95,1,5,153,54,152,25,246,194,42,197,121,91,24,167,88,30,12,39,3,210,231,67,237,248,100,112,18,104,254,196,247,157,156,180,205,114,116,107,169,61,178,138,151,242,206,55,182,20,73,97,236,189,120] ),
            ENB: JSON.stringify( [243,11,147,71,207,28,97,244,89,139,0,223,204,105,92,133,227,79,69,229,138,155,161,250,135,187,67,72,9,100,77,22,130,80,150,50,65,179,145,209,29,132,127,35,91,126,200,237,103,124,226,49,113,230,225,20,27,177,110,240,10,165,184,19,8,76,211,26,159,90,245,195,66,231,104,43,206,73,57,86,241,182,178,193,171,108,181,63,215,70,37,52,236,219,68,158,38,198,14,189,148,116,64,242,191,137,221,78,217,173,233,153,40,248,41,123,59,119,255,114,224,235,141,2,149,75,98,55,253,99,174,21,42,246,117,128,143,212,208,196,51,213,39,93,122,34,154,194,218,183,95,54,88,192,46,96,169,47,107,188,94,201,121,252,61,167,62,190,170,238,176,175,74,157,205,146,84,186,144,118,172,160,5,129,136,30,234,228,156,134,220,222,81,125,152,199,23,197,58,48,185,6,131,102,115,254,1,31,109,202,17,53,120,140,232,13,101,32,25,203,4,168,36,166,214,7,180,33,216,18,12,151,106,15,112,142,251,210,24,3,247,164,16,249,44,60,239,45,162,82,163,56,87,83,111,85] ),
            MATRIX: JSON.stringify( new Proxy( function*(){
                yield [1, 0, 0, 0]
                yield [0, 1, 0, 0]
                yield [0, 0, 1, 0]
                yield [0, 0, 0, 1]
            }, {
                apply(...args){
                    const GEN = Reflect.apply( ...args )
                    return [...GEN]
                }
            } )() )
        })
    ]
}