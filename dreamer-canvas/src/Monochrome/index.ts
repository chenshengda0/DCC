import {
    Upload,
    Download,
    runtimeDecorator,
} from "../Common"

type colorType = 'r'|'g'|'b';

export default class Monochrome{

    private static container: any;
    private static offset: any;

    constructor(domID:string){
        Monochrome.container = document.getElementById( domID )
        Monochrome.offset = Monochrome.container.getBoundingClientRect()
    }

    @runtimeDecorator()
    render(colorType:colorType = "g"){
        //创建主canvas
        const canvas = document.createElement( "canvas" )
        const ctx = canvas.getContext( "2d" )
        const W = canvas.width = Monochrome.container.clientWidth;
        const H = canvas.height = Monochrome.container.clientHeight;

        //创建显示canvas
        const scanvas = document.createElement( "canvas" )
        const sctx = scanvas.getContext( "2d" )
        scanvas.width = W;
        scanvas.height = H;

        //创建操作canvas
        const hcanvas = document.createElement( "canvas" )
        const hctx = hcanvas.getContext( "2d" )
        hcanvas.width = W;
        hcanvas.height = H;

        //实例化操作对象
        const upload = new Upload(W, H, Monochrome.offset).draw( hctx )
        const download = new Download(W, H, Monochrome.offset).draw( hctx )

        canvas.addEventListener( "click", function(e){
            switch( true ){
                case upload.inArea( e.x, e.y ):
                    //创建fileinput
                    const file = document.createElement( "input" )
                    file.type = "file"
                    file.accept = "image/png,image/jpeg,image/webp,image/jpg"
                    file.multiple = false
                    //file.hidden = true
                    file.addEventListener( "change", function(e){
                        // @ts-ignore
                        let f = e.target.files[0]
                        if( f ){
                            const fr = new FileReader()
                            fr.readAsDataURL( f )
                            fr.onload = function(file){
                                const img = new Image()
                                img.src = file.target?.result as string;
                                img.addEventListener( "load", function(){
                                    const tcanvas = document.createElement( "canvas" )
                                    const tctx = tcanvas.getContext( "2d" )
                                    tcanvas.width = W;
                                    tcanvas.height = H;

                                    tctx?.save()
                                    tctx?.drawImage( img, 0, 0, img.width, img.height, 0, 0, W, H )
                                    tctx?.restore();
                                    const metaData:any = tctx?.getImageData( 0, 0, W, H )
                                    switch( true ){
                                        case colorType === "r":
                                            for( let i = 0; i < metaData.data.length; ++i ){
                                                switch( true ){
                                                    case i % 4 === 1:
                                                        metaData.data[i] = 0;
                                                        break;
                                                    case i % 4 === 2:
                                                        metaData.data[i] = 0;
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }
                                            sctx?.clearRect( 0, 0, W, H )
                                            sctx?.putImageData( metaData, 0, 0 )
                                            break;
                                        case colorType === "g":
                                            for( let i = 0; i < metaData.data.length; ++i ){
                                                switch( true ){
                                                    case i % 4 === 0:
                                                        metaData.data[i] = 0;
                                                        break;
                                                    case i % 4 === 2:
                                                        metaData.data[i] = 0;
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }
                                            sctx?.clearRect( 0, 0, W, H )
                                            sctx?.putImageData( metaData, 0, 0 )
                                            break;
                                        case colorType === "b":
                                            for( let i = 0; i < metaData.data.length; ++i ){
                                                switch( true ){
                                                    case i % 4 === 0:
                                                        metaData.data[i] = 0;
                                                        break;
                                                    case i % 4 === 1:
                                                        metaData.data[i] = 0;
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }
                                            sctx?.clearRect( 0, 0, W, H )
                                            sctx?.putImageData( metaData, 0, 0 )
                                            break;
                                        default:
                                            break;
                                    }
                                } )
                            }
                        }
                    } )
                    file.click();
                    break;
                case download.inArea( e.x, e.y ):
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
                    const x = e.x - Monochrome.offset.left
                    const y = e.y - Monochrome.offset.top
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

        //定时器
        ;( function move(){
            ctx?.clearRect( 0, 0, W, H )
            ctx?.drawImage( scanvas, 0, 0 )
            ctx?.drawImage( hcanvas, 0, 0 )
            window.requestAnimationFrame( move )
        } )()

        Monochrome.container.appendChild( canvas )
    }

}