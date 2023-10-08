import {runtimeDecorator} from "../Common"

export default class Hollow{

    private static container: any;
    private static offset: any;

    constructor(domID:string){
        Hollow.container = document.getElementById( domID );
        Hollow.offset = Hollow.container.getBoundingClientRect()
    }

    @runtimeDecorator()
    async render( message:string = "请输入要显示的内容", fontSize:number = 500, changeFrame:number = 60 ){
        //设置主canvas
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = Hollow.container.clientWidth;
        const H = canvas.height = Hollow.container.clientHeight;

        const list = await new Proxy( function*(){
            //设置主canvas
            const canvas = document.createElement( "canvas" )
            const ctx:any = canvas.getContext( "2d" )
            const W = canvas.width = Hollow.container.clientWidth;
            const H = canvas.height = Hollow.container.clientHeight;
            for( let i = 0; i < message.length; ++i ){
                //设置dom
                const span = document.createElement( "span" )
                span.style.fontSize = `${fontSize}px`;
                span.style.display = "inline-block"
                span.innerHTML = message[i];
                document.body.appendChild( span )
                const IW = span.clientWidth;
                const IH = span.clientHeight;
                document.body.removeChild( span )
                //创建画布
                const icanvas = document.createElement( "canvas" )
                const ictx:any = icanvas.getContext( "2d" )
                icanvas.width = IW;
                icanvas.height = IH;
                ictx.save()
                ictx.clearRect( 0, 0, IW , IH )
                ictx.fillStyle = "#FFF";
                ictx.fillRect( 0, 0, IW , IH )
                ictx.restore()
                //写入文字
                ictx.font = `bold ${fontSize}px sans-serif`
                ictx.fillText( message[i], 0, fontSize )
                yield new Promise( (resolve, reject) => {
                    const metaData = ictx.getImageData( 0, 0, IW, IH )
                    const indexData = new Proxy( function*(){
                        const indexData = []
                        for( let i = (metaData.data.length >> 2)-1; i >= 0; --i ){
                            indexData.push( i )
                        }
                        while( indexData.length > 0 ){
                            const currentData = []
                            for( let i = 0; i < IW; ++i ){
                                currentData.push( indexData.pop() )
                            }
                            yield currentData;
                        }
                    }, {
                        apply(...args){
                            const GEN = Reflect.apply( ...args )
                            const ANS = [...GEN]
                            return ANS
                        }
                    } )() as unknown as number[][];
                    const lastData = JSON.parse( JSON.stringify( indexData ) )
                    for( let i = 0; i < indexData.length; ++i ){
                        for( let j = 0; j < indexData[i].length; ++j ){
                            const currentIndex = indexData[i][j]
                            lastData[i][j] = metaData.data[ (currentIndex << 2) + 0 ] * 0.3 + metaData.data[ (currentIndex << 2) + 1 ] * 0.59 + metaData.data[ (currentIndex << 2) + 2 ] * 0.11;
                        }
                    }
                    return resolve( Object.assign( {}, {metaData, indexData, lastData} ) )
                } )
                //二值化
                .then( async(res:any)=>{
                    //计算平均值
                    const aves = []
                    for( let i = 0; i < res.lastData.length; ++i ){
                        aves.push( res.lastData[i].reduce( (prev:number,cur:number) => prev += cur, 0 ) / res.lastData[i].length )
                    }
                    const ave = aves.reduce( (prev:number ,cur:number) => prev += cur , 0 ) / aves.length | 0;
                    const twoData = JSON.parse( JSON.stringify( res.indexData ) )
                    for( let i = 0; i < res.indexData.length; ++i ){
                        for( let j = 0; j < res.indexData[i].length; ++j ){
                            twoData[i][j] = res.lastData[i][j] > ave ? 255 : 0;
                        }
                    }
                    return Object.assign( res, {twoData, lastData: twoData} );
                } )
                //计算sobel算子
                .then( async(res:any)=>{
                    const axios = JSON.parse( JSON.stringify( res.lastData ) )
                    for( let i = 1; i < res.indexData.length - 1; ++i ){
                        for( let j = 1; j < res.indexData[i].length - 1; ++j ){
                            const xAxios = (res.lastData[i-1][j + 1] - res.lastData[i-1][j - 1]) + (res.lastData[i][j + 1] - res.lastData[i][j - 1]) * 2 + (res.lastData[i+1][j + 1] - res.lastData[i+1][j - 1])
                            const yAxios = ( res.lastData[i+1][j-1] - res.lastData[i-1][j-1] ) + ( res.lastData[i+1][j] - res.lastData[i-1][j] ) * 2 + ( res.lastData[i+1][j+1] - res.lastData[i-1][j+1] )
                            axios[i][j] = Math.sqrt( xAxios ** 2 + yAxios ** 2 ) >= 255 ? 0 : 255;
                        }
                    }
                    return Object.assign( res, {axios, lastData: axios} )
                } )
                //修改metaData
                .then( async(res:any)=>{
                    for( let i = 0; i < res.indexData.length; ++i ){
                        for( let j = 0; j < res.indexData[i].length; ++j ){
                            const currentIndex = res.indexData[i][j]
                            if( res.lastData[i][j] === 0 ){
                                res.metaData.data[ (currentIndex << 2) + 0 ] = 0
                                res.metaData.data[ (currentIndex << 2) + 1 ] = 0
                                res.metaData.data[ (currentIndex << 2) + 2 ] = 0
                                res.metaData.data[ (currentIndex << 2) + 3 ] = 255
                            }else{
                                res.metaData.data[ (currentIndex << 2) + 0 ] = 0
                                res.metaData.data[ (currentIndex << 2) + 1 ] = 0
                                res.metaData.data[ (currentIndex << 2) + 2 ] = 0
                                res.metaData.data[ (currentIndex << 2) + 3 ] = 0
                            }
                        }
                    }
                    return res;
                } )
                //返回结果
                .then( async(res:any)=>{
                    //console.log( res )
                    ictx.clearRect( 0, 0, IW, IH )
                    ictx.putImageData( res.metaData, 0, 0 )
                    ctx.clearRect( 0, 0, W, H )
                    ctx.drawImage( icanvas, 0, 0, IW, IH, 0, 0, W, H )
                    return ctx.getImageData( 0, 0, W, H );
                } )
            }
        }, {
            async apply(...args){
                const GEN = Reflect.apply( ...args )
                const list = await Promise.all( [...GEN] );
                return list
            }
        } )() as any;

        let index = 0;
        let times = 0
        ;( function move(){
            times++;
            if( times >= changeFrame ){
                times = 0;
                index++;
                if( index >= message.length ){
                    index = 0;
                }
            }
            //写入主canvas
            ctx.clearRect( 0, 0, W, H )
            ctx.putImageData( list[index], 0, 0 )
            window.requestAnimationFrame( move )
        } )()
        //追加到container
        Hollow.container.appendChild( canvas )
        return ;
    }
}