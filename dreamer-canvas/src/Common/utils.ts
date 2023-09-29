export const sleep = async(wait:number = 1000) => await new Promise( (resolve, reject)=>window.setTimeout( resolve, wait ) )

export const runtimeDecorator = function():MethodDecorator{
    return ( target:any, method:any, descriptor:any )=>{
        descriptor.value = new Proxy( descriptor.value, {
            apply: function(...args){
                console.error(`============================================================START: ${method} ============================================================`)
                try{
                    console.error( "time: ", new Date() );
                    console.error( "args: ", args )
                    return Reflect.apply( ...args )
                }catch(err:any){
                    console.error( err )
                }finally{
                    console.error(`==============================================================END: ${method} ============================================================`)
                }

            }
        } )
    }
} 