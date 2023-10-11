export const sleep = async(wait:number = 1000) => await new Promise( (resolve, reject)=>window.setTimeout( resolve, wait ) )

export const runtimeDecorator = function():MethodDecorator{
    return ( target:any, method:any, descriptor:any )=>{
        descriptor.value = new Proxy( descriptor.value, {
            apply: function(...args){
                console.log(`============================================================START: ${method} ============================================================`)
                try{
                    console.log( "email: ", "chen_shengda@yeah.net" )
                    console.log( "time: ", new Date() );
                    console.log( "args: ", args )
                    return Reflect.apply( ...args )
                }catch(err:any){
                    console.error( err )
                }finally{
                    console.log(`==============================================================END: ${method} ============================================================`)
                }

            }
        } )
    }
} 

export const getRandom = function(arr:number[], isInt:boolean = false ){
    const min = Math.min( ...arr )
    const max = Math.max( ...arr )
    const num = Math.random() * ( max - min ) + min;
    return isInt ? Math.round( num ) : num;
}

//二维数组转置
const T = function(source:number[][]){
    const row = source.length;
    const col = source[0].length;
    const target = Array.from( {length: col}, ()=> Array.from( {length:row}, ()=>0 ) )
    for( let i = 0; i < source.length; ++i ){
        for( let j = 0; j < source[i].length; ++j ){
            target[j][i] = source[i][j]
        }
    }
    return target;
}

//矩阵乘积
export const getAxis = function(left:number[][], right:number[][] = [[0],[0],[0],[1]], isPoint:boolean = false):number[][]{
    const tright = isPoint ? right : T( right );
    if( left[0].length !== right.length ){
        throw new Error("矩阵长度不匹配");
    }
    return new Proxy( function*(){
        for( let n = 0; n < tright.length; ++n ){
            const target = []
            for( let m = 0; m < left.length; ++m ){
                target.push( (function( source:number[], center:number[] ){
                    const DFS = function(i:number = 0, target:number = 0):number{
                        switch(true){
                            case i === source.length:
                                return target;
                            default:
                                return DFS( i+1, target + source[i] * center[i] )
                        }
                    }
                    return DFS();
                })( left[m], tright[n] ) )
            }
            yield target;
        }
    }, {
        apply(...args){
            const GEN = Reflect.apply( ...args )
            return isPoint ?  [...GEN] : T( [...GEN] );
        }
    } )() as unknown as number[][];
}

export const matrix3D = function(source:number[][]){
    if( source.length !== 4 || source[0].length !== 4 ) throw new Error("请输入4*4矩阵")
    const tSource = T( source )
    //二维坐标转一维坐标
    const target = new Proxy( function*(){
        for( let i = 0 ; i < tSource.length; ++i ){
            for( let j = 0; j < tSource[i].length; ++j ){
                yield tSource[i][j]
            }
        }
    }, {
        apply(...args){
            return [...Reflect.apply(...args)]
        }
    } )() as unknown as number[];
    return `matrix3d(${target.join(",")})`
}

export const matrix2D = function( source:number[][] ):number[]{
    if( source.length !== 4 || source[0].length !== 4 ) throw new Error("请输入4*4矩阵")
    return new Proxy( function*(){
        yield source[0][0];
        yield source[1][0];
        yield source[0][1];
        yield source[1][1];
        yield source[0][3];
        yield source[1][3];
    }, {
        apply(...args){
            return [...Reflect.apply(...args)]
        }
    } )() as unknown as number[];
}
