import {
    Upload,
    Download,
    ScaleUp,
    ScaleDown,
    //计算矩阵
    getAxis,
    matrix2D,
} from "../Common"

class ShowImage{
    private matrix:number[][] = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    
    constructor(props:any){
        Object.assign( this, props )
        return this;
    }

    draw(ctx:any){
        //计算4个点坐标
        const points = new Proxy( function*(){
            yield [ 60,   60, 0, 1]
            yield [ 60,  -60, 0, 1]
            yield [-60,  -60, 0, 1]
            yield [-60,   60, 0, 1]
        }, {
            apply: (...args)=>{
                return [ ...Reflect.apply( ...args ) ]
            }
        } )() as unknown as number[][]
        ctx.save()
        ctx.setTransform( ...matrix2D(this.matrix) )
        ctx.fillStyle = "red"
        ctx.beginPath()
        for( const point of points ){
            ctx.lineTo( point[0], point[1] )
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
    }


}

export default class MatrixImage{

    private static container:any;
    private static offset:any;

    constructor(domID:string){
        MatrixImage.container = document.getElementById( domID )
        MatrixImage.offset = MatrixImage.container.getBoundingClientRect()
    }

    render(angel:number = 5){
        const radian =  angel % 360 / 180 * Math.PI;
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = MatrixImage.container.clientWidth;
        const H = canvas.height = MatrixImage.container.clientHeight;

        //创建操作canvas
        const hcanvas = document.createElement( "canvas" )
        const hctx:any = hcanvas.getContext( "2d" )
        hcanvas.width = W;
        hcanvas.height = H;
        const upload = new Upload( W, H, MatrixImage.offset ).draw( hctx );
        const download = new Download( W, H, MatrixImage.offset ).draw( hctx );


        //创建显示canvas
        const scanvas = document.createElement( "canvas" )
        const sctx:any = scanvas.getContext( "2d" )
        scanvas.width = W;
        scanvas.height = H;

        const show = new ShowImage({
            matrix: [
                [1, -0.5, 0, W / 2],
                [0, 1, 0, H / 2],
                [0, 0, 1, 0],
                [0, 0, 0, 1],
            ]
        }).draw( sctx )

        //定义事件
        canvas.addEventListener( "touchstart", function(e){
            //e.preventDefault()
            switch(true){
                case upload.inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    const input = document.createElement( "input" )
                    input.type = "file"
                    input.accept = "image/png,image/jpeg,image/webp,image/jpg"
                    input.multiple = false
                    input.addEventListener( "change", function(e){
                        //@ts-ignore
                        const file = e.target.files[0];
                        const fr = new FileReader()
                        fr.readAsDataURL( file )
                        fr.addEventListener( "load", function(e){
                            const img = new Image()
                            img.src = e.target?.result as string;
                            img.addEventListener( "load", function(e){
                                const tcanvas = document.createElement( "canvas" )
                                const tctx:any = tcanvas.getContext( "2d" )
                                const moveX = Math.abs(Math.tan( radian ) * H);
                                tcanvas.width =  W + moveX;
                                tcanvas.height = H;
                                if( radian >= 0 ){
                                    tctx.setTransform(1, 0, -Math.tan( radian ), 1, moveX, 0);
                                }else{
                                    tctx.setTransform(1, 0, -Math.tan( radian ), 1, 0, 0);
                                }
                                
                                tctx.drawImage( img, 0, 0, img.width, img.height, 0, 0, W, H )
                                sctx.drawImage( tcanvas, 0, 0, tcanvas.width, tcanvas.height, 0, 0, W, H )
                            } )
                        } )
                    } )
                    input.click()
                    break;
                case download.inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    scanvas.toBlob( function(blob:any){
                        const blobURL = URL.createObjectURL( blob )
                        window.dispatchEvent( new CustomEvent( "dream_canvas_save_img", {
                            detail: {
                                blobURL,
                            }
                        } ) )
                    } )
                    break;
                default:
                    const x = e.touches[0].pageX - MatrixImage.offset.left
                    const y = e.touches[0].pageY - MatrixImage.offset.top
                    //获取当前点颜色
                    const metaData:any = ctx?.getImageData( x, y , 1, 1 )
                    const r = metaData.data[0]
                    const g = metaData.data[1]
                    const b = metaData.data[2]
                    const a = metaData.data[3] / 255
                    const gray = (r * 0.3 + g * 0.59 + b * 0.11) | 0;
                    window.dispatchEvent( new CustomEvent( "dream_canvas_show_color",{ detail: {
                        axis: {x, y},
                        rgb: `rgba(${r},${g},${b},${a})`,
                        hex: `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`,
                        gray: `rgb(${gray},${gray},${gray},1)`,
                    } } ) )
                    break;
            }
        } )

        ;( function move(){
            ctx.clearRect( 0, 0, W, H )
            ctx.drawImage( scanvas, 0, 0 )
            ctx.drawImage( hcanvas, 0, 0 )
            window.requestAnimationFrame( move )
        } )()

        MatrixImage.container.appendChild( canvas )

    }

}