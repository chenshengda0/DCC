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
    if( left[0].length !== tright[0].length) throw new Error("矩阵长度不匹配");
    return new Proxy( function*(){
        for( let n = 0; n < tright.length; ++n ){
            const target = []
            for( let m = 0; m < left.length; ++m ){
                target.push( (function( source:number[], center:number[] ){
                    return source.reduce( (prev:number, cur:number, index:number) => prev + source[index] * center[index], 0 )
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

//矩阵应用,使用矩阵计算数组平均值与和，因为矩阵计算使用了递归，故数组长度应小于4000
export const getAve = function(source:number[]){
    const mat  = new Proxy( function*(count:number){
        const ave = Array.from( {length: count}, ()=> 1 )
        const sum = Array.from( {length: count}, ()=> 1 / count )
        yield ave;
        yield sum;
    }, {
        apply: (...args)=>{
            return [...Reflect.apply( ...args )]
        }
    } )( source.length ) as unknown as number[][]
    const param = getAxis( [source], mat, true );
    return {
        source,
        count: source.length,
        sum: param[0][0],
        ave: param[1][0],
    }
}

//矩阵应用，计算像素灰度值
export const getGray = function(rgba:number[]){
    if( rgba.length !== 4 ) throw new Error( "请输入rgba数组" )
    return getAxis( [[0.3, 0.59, 0.11, 0]], [rgba], true )[0][0] | 0;
}

//3*3矩阵求逆矩阵( three.js Matrix3 https://github.com/mrdoob/three.js/tree/dev/src/math/Matrix3.js )
const mat3invert = (source:number[][])=>{
    //转一维数组
    const te = new Proxy( function*(){
        for(let i = 0; i < source.length; ++i){
            for( let j = 0; j < source[i].length; ++j ){
                yield source[i][j]
            }
        }
    }, {
        apply: (...args) => [...Reflect.apply(...args)]
    } )() as unknown as number[]

    const n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ],
    n12 = te[ 3 ], n22 = te[ 4 ], n32 = te[ 5 ],
    n13 = te[ 6 ], n23 = te[ 7 ], n33 = te[ 8 ],

    t11 = n33 * n22 - n32 * n23,
    t12 = n32 * n13 - n33 * n12,
    t13 = n23 * n12 - n22 * n13,

    det = n11 * t11 + n21 * t12 + n31 * t13;

    if ( det === 0 ) return [
        [0, 0, 0,],
        [0, 0, 0,],
        [0, 0, 0,],
    ];

    const detInv = 1 / det;

    te[ 0 ] = t11 * detInv;
    te[ 1 ] = ( n31 * n23 - n33 * n21 ) * detInv;
    te[ 2 ] = ( n32 * n21 - n31 * n22 ) * detInv;

    te[ 3 ] = t12 * detInv;
    te[ 4 ] = ( n33 * n11 - n31 * n13 ) * detInv;
    te[ 5 ] = ( n31 * n12 - n32 * n11 ) * detInv;

    te[ 6 ] = t13 * detInv;
    te[ 7 ] = ( n21 * n13 - n23 * n11 ) * detInv;
    te[ 8 ] = ( n22 * n11 - n21 * n12 ) * detInv;

    //结果转换成二维矩阵
    return new Proxy( function*(){
        const revert = te.reverse();
        while( revert.length > 0 ){
            const ans = [];
            for( let i = 0; i < 3; ++i ){
                ans.push( revert.pop() )
            }
            yield ans;
        }
    },{apply:(...args)=>[...Reflect.apply( ...args )]} )() as unknown as number[][];
}

//4*4矩阵求逆矩阵( three.js Matrix4 https://github.com/mrdoob/three.js/tree/dev/src/math/Matrix4.js)
const mat4invert = (source:number[][])=>{
    //转一维数组
    const te = new Proxy( function*(){
        for(let i = 0; i < source.length; ++i){
            for( let j = 0; j < source[i].length; ++j ){
                yield source[i][j]
            }
        }
    }, {
        apply: (...args) => [...Reflect.apply(...args)]
    } )() as unknown as number[]
    const n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ], n41 = te[ 3 ],
        n12 = te[ 4 ], n22 = te[ 5 ], n32 = te[ 6 ], n42 = te[ 7 ],
        n13 = te[ 8 ], n23 = te[ 9 ], n33 = te[ 10 ], n43 = te[ 11 ],
        n14 = te[ 12 ], n24 = te[ 13 ], n34 = te[ 14 ], n44 = te[ 15 ],

        t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
        t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
        t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
        t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
    if ( det === 0 ) return [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    const detInv = 1 / det;
    te[ 0 ] = t11 * detInv;
    te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
    te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
    te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

    te[ 4 ] = t12 * detInv;
    te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
    te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
    te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

    te[ 8 ] = t13 * detInv;
    te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
    te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
    te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

    te[ 12 ] = t14 * detInv;
    te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
    te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
    te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;
    //结果转换成二维矩阵
    return new Proxy( function*(){
        const revert = te.reverse();
        while( revert.length > 0 ){
            const ans = [];
            for( let i = 0; i < 4; ++i ){
                ans.push( revert.pop() )
            }
            yield ans;
        }
    },{apply:(...args)=>[...Reflect.apply( ...args )]} )() as unknown as number[][];
}


export const invert = (source:number[][]) => {
    switch( true ){
        case source.length === 3 && source[0].length === 3:
            return mat3invert( source );
        case source.length === 4 && source[0].length === 4:
            return mat4invert( source );
        default:
            throw new Error("该方法只支持3*3矩阵，4*4方阵")
    }
}


//碰撞检测
export const impact = function(b0:any, b1:any){
    const dist = Math.sqrt( (b1["matrix"][1][3] - b0["matrix"][1][3]) ** 2 + (b1["matrix"][0][3] - b0["matrix"][0][3]) ** 2 )
    if( dist >= b1["R"] + b0["R"] ) return ;
    //获取旋转角度
    const angel = Math.atan2( b1["matrix"][1][3] - b0["matrix"][1][3], b1["matrix"][0][3] - b0["matrix"][0][3] )
    let x0 = 0;
    let y0 = 0;
    //位置矩阵
    const matrix = [ [Math.cos( angel ), Math.sin( angel ), 0, x0 ], [-Math.sin( angel ), Math.cos( angel ), 0, y0 ], [ 0, 0, 1, 0], [0, 0, 0, 1] ]
    //计算x1, y1 位置
    let param = getAxis( matrix, [[ b1["matrix"][0][3] - b0["matrix"][0][3], b1["matrix"][1][3] - b0["matrix"][1][3], 0, 1 ]], true )
    let x1 = param[0][0]
    let y1 = param[0][1]
    //速度矩阵
    const vmatrix = [ [Math.cos( angel ), Math.sin( angel ), 0, 0], [-Math.sin( angel ), Math.cos( angel ), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1] ]
    const iv = getAxis( vmatrix, [[b0.vx, b0.vy, 0, 1]], true )
    const jv = getAxis( vmatrix, [[b1.vx, b1.vy, 0, 1]], true )
    const ivx = iv[0][0]
    const ivy = iv[0][1]
    const jvx = jv[0][0]
    const jvy = jv[0][1]
    //计算x轴上碰撞之后的速度
    const ivFinal = (( b0.R ** 3 - b1.R ** 3 ) * ivx + 2 * b1.R ** 3 * jvx) / ( b0.R ** 3 + b1.R ** 3 )
    const jvFinal = (( b1.R ** 3 - b0.R ** 3 ) * jvx + 2 * b0.R ** 3 * ivx) / ( b0.R ** 3 + b1.R ** 3 )
    //计算重合深度
    const lep = ( (b0.R + b1.R) - Math.abs( x1 - x0 ) ) / 2;
    //重置两个小球位置
    x0 = x0 + ( ivFinal < 0 ? -lep : lep )
    x1 = x1 + ( jvFinal < 0 ? -lep : lep )
    //还原位置矩阵
    const omatrix = [ [Math.cos( angel ), -Math.sin( angel ), 0, x0 ], [Math.sin( angel ), Math.cos( angel ), 0, y0 ], [ 0, 0, 1, 0], [0, 0, 0, 1] ]
    const oi = getAxis( omatrix, [ [x0, y0, 0, 1] ], true )
    const oj = getAxis( omatrix, [ [x1, y1, 0, 1] ], true )
    b1["matrix"][0][3] = oj[0][0] + b0["matrix"][0][3];
    b1["matrix"][1][3] = oj[0][1] + b0["matrix"][1][3];
    b0["matrix"][0][3] += oi[0][0];
    b0["matrix"][1][3] += oi[0][1];
    //还原速度矩阵
    const ovmatrix = [ [Math.cos( angel ), -Math.sin( angel ), 0, 0 ], [Math.sin( angel ), Math.cos( angel ), 0, 0 ], [ 0, 0, 1, 0], [0, 0, 0, 1] ]
    const oiv = getAxis( ovmatrix, [ [ivFinal, ivy, 0, 1] ], true )
    const ojv = getAxis( ovmatrix, [ [jvFinal, jvy, 0, 1] ], true )
    b0.vx = oiv[0][0]
    b0.vy = oiv[0][1]
    b1.vx = ojv[0][0]
    b1.vy = ojv[0][1]
    b0.diretion *= -1
    b1.diretion *= -1
    return ;
}

//计算n*n方阵行列式值(拉普拉斯展开)
export const determinant = function(source:number[][]){
    if( source.length !== source[0].length || source.length <= 0) throw new Error( "请输入n*n矩阵" )
    const n = source.length;
    switch( true ){
        case n <= 0:
            throw new Error( "请输入n*n方阵" )
        case n === 1:
            return source[0][0];
        case n === 2:
            return source[0][0] * source[1][1] - source[1][0] * source[0][1];
        case n === 3:
            let three = 0;
            const one = Array.from( {length: n}, ()=>Array.from({length: n<<1}, ()=>0) )
            for( let i = 0; i < n; ++i ){
                for( let j = 0; j < (n<<1); ++j ){
                    if( j < n ){
                        one[i][j] = source[i][j]
                    }else{
                        one[i][j] = source[i][j % n]
                    }
                }
            }
            //console.log( one )
            for( let col = 0; col < n; ++col ){
                const DFS = function(c:number = 0, r:number = 0, current:number = 1):number{
                    switch( true ){
                        case r >= n:
                            return current;
                        default:
                            return DFS( c + 1, r + 1, current * one[r][c] )
                    }
                }
                const current = DFS( col )
                three += current;
                //console.log( current, three )
            }

            for( let col = n; col < n<<1; ++col ){
                const DFS = function(c:number = 0, r:number = 0, current:number = 1):number{
                    switch( true ){
                        case r >= n:
                            return current;
                        default:
                            return DFS( c - 1, r + 1, current * one[r][c] )
                    }
                }
                const current = DFS( col )
                three -= current;
                
            }
            //console.log( source, three )
            return three;
        default:
            let four = 0;
            const first = [ ...source[0] ]
            for( let i = 0; i < first.length; ++i ){
                if( (i&1) === 1 ){
                    four -= new Proxy( function*(index:number){
                        for( let r = 1; r < n; ++r ){
                            const current = []
                            for( let c = 0; c < n; ++c ){
                                if( c !== index ) current.push( source[r][c] )
                            }
                            yield current;
                        }
                    }, {apply: (...args)=>{
                        const result = [...Reflect.apply(...args)]
                        return determinant( result );
                    }} )( i ) as unknown as number * first[i];
                }else{
                    four += new Proxy( function*(index:number){
                        for( let r = 1; r < n; ++r ){
                            const current = []
                            for( let c = 0; c < n; ++c ){
                                if( c !== index ) current.push( source[r][c] )
                            }
                            yield current;
                        }
                    }, {apply: (...args)=>{
                        const result = [...Reflect.apply(...args)]
                        return determinant( result );
                    }} )( i ) as unknown as number * first[i];
                }
            }
            //console.log( source, four )
            return four;
    }
}

//计算伴随矩阵
export const adjoint = function(source:number[][]){
    if( source.length !== source[0].length || source.length < 2 ) throw new Error( "请输入n*n矩阵" )
    const n = source.length;
    switch( true ){
        case n === 2:
            //主对调，副取反
            const two = Array.from( {length:n}, ()=>Array.from( {length:n}, ()=>0 ) )
            two[0][0] = source[1][1];
            two[0][1] = -source[0][1];
            two[1][0] = -source[1][0];
            two[1][1] = source[0][0];
            return two;
        default:
            const one = Array.from( {length: (n<<1) - 1}, ()=>Array.from( {length: (n<<1) - 1}, ()=>0 ) )
            for( let i = 0; i < n; ++i ){
                for( let j = 0; j < n; ++j ){
                    one[i][j] = source[i][j]
                }
            }
            for( let i = 0; i < n; ++i ){
                for( let j = n; j < (n<<1) - 1; ++j ){
                    one[i][j] = source[i][j % n]
                }
            }
            for( let c = n; c < (n<<1) - 1; ++c ){
                one[c] = [ ...one[c%n] ]
            }
            //console.log( "one: ", one )
            const target = Array.from( {length: n}, ()=> Array.from( {length: n}, ()=>0 ) )
            for( let i = 1; i <= n; ++i ){
                for( let j = 1; j <= n; ++ j ){
                    const current = Array.from( {length: n -1}, ()=> Array.from( {length: n - 1}, ()=>0 ) )
                    for( let row = 0; row < n-1; ++row ){
                        for( let col = 0; col < n-1; ++col ){
                            current[row][col] = one[i+row][j+col]
                        }
                    }
                    target[i-1][j-1] = determinant( current )
                }
            }
            //console.log( "伴随矩阵", T(target) )
            return T(target);
    }

}
