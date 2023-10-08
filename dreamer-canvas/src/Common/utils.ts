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