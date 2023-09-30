export const sleep = async(wait:number = 1000) => await new Promise( (resolve, reject)=>window.setTimeout( resolve, wait ) )

export const runtimeDecorator = function():MethodDecorator{
    return ( target:any, method:any, descriptor:any )=>{
        descriptor.value = new Proxy( descriptor.value, {
            apply: function(...args){
                console.log(`============================================================START: ${method} ============================================================`)
                try{
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