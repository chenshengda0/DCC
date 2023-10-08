import {
    Upload,
    Download,
    runtimeDecorator,
} from "../Common"

export default class ColorPicker{

    private static contianer: any;
    private static offset: any;

    constructor(domID:string){
        ColorPicker.contianer = document.getElementById( domID )
        //禁用事件
        ColorPicker.offset = ColorPicker.contianer.getBoundingClientRect()
    }

    @runtimeDecorator()
    render(){
        //创建canvas
        const canvas = document.createElement( "canvas" )
        const ctx = canvas.getContext( "2d" )
        const W = canvas.width = ColorPicker.contianer.clientWidth;
        const H = canvas.height = ColorPicker.contianer.clientHeight;

        //用于控制的canvas
        const hcanvas = document.createElement( "canvas" )
        const hctx = hcanvas.getContext( "2d" )
        hcanvas.width = W;
        hcanvas.height = H
        const upload = new Upload(W, H, ColorPicker.offset ).draw( hctx )
        const download = new Download(W, H, ColorPicker.offset ).draw( hctx )

        //用于显示的canvas
        const scanvas = document.createElement( "canvas" )
        const sctx = scanvas.getContext( "2d" )
        scanvas.width = W;
        scanvas.height = H;

        canvas.addEventListener( "click", function(e){
            switch( true ){
                case upload.inArea( e.x, e.y ):
                    //创建fileinput
                    const file = document.createElement( "input" )
                    file.type = "file"
                    file.accept = "image/png,image/jpeg,image/webp,image/jpg"
                    file.multiple = false
                    //file.hidden = true
                    //document.body.appendChild( file )
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
                                    sctx?.clearRect( 0, 0, W, H )
                                    sctx?.save()
                                    sctx?.drawImage( img, 0, 0, img.width, img.height, 0, 0, W, H )
                                    sctx?.restore();
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
                    const x = e.x - ColorPicker.offset.left
                    const y = e.y - ColorPicker.offset.top
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

        //追加到dom
        ColorPicker.contianer.appendChild( canvas )
    }
}