import {
    invert,
    getAxis,
    getRandom,
    getAve,
    matrix3D,
} from "../Common"

export default  class MyTest{
    private static container:any;
    private static offset:any;

    constructor(domID:string){
        MyTest.container = document.getElementById( domID )
        MyTest.offset = MyTest.container.getBoundingClientRect()
    }

    render(){
        const matrix = [
            [Math.cos( Math.PI ), -Math.sin( Math.PI ), 0, 20],
            [Math.sin( Math.PI ), Math.cos( Math.PI ), 0, 20],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]
        console.log( matrix3D( matrix ) )
        //console.log( getAve( mt3 ) )
    }

}