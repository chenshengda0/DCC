import {
    Download,
    runtimeDecorator,
} from "../Common"

import html2canvas from "html2canvas"

export default class Html2Png{

    private static container:any;
    private static offset:any;


    constructor(domID:string){
        Html2Png.container = document.getElementById( domID )
        Html2Png.offset = Html2Png.container.getBoundingClientRect()
    }

    @runtimeDecorator()
    async render(targetID:string){
        const target:any = document.getElementById( targetID );
        const tcanvas = await html2canvas( target );

        const canvas = document.createElement( "canvas" )
        const ctx = canvas.getContext( "2d" )
        const W = canvas.width = Html2Png.container.clientWidth;
        const H = canvas.height = Html2Png.container.clientHeight;

        const hcanvas = document.createElement( "canvas" )
        const hctx = hcanvas.getContext( "2d" )
        hcanvas.width = W;
        hcanvas.height = H;
        const download = new Download( W, H, Html2Png.offset ).draw( hctx );

        const scanvas = document.createElement( "canvas" )
        const sctx = scanvas.getContext( "2d" )
        scanvas.width = W;
        scanvas.height = H;
        sctx?.drawImage( tcanvas, 0, 0, tcanvas.width, tcanvas.width, 0, 0, W, H );

        canvas.addEventListener( "touchstart", function(e){
            switch( true ){
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
                    const x = (e.touches[0].pageX - Html2Png.offset.left) | 0
                    const y = (e.touches[0].pageY - Html2Png.offset.top) | 0
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
            ctx?.clearRect( 0, 0, W ,H )
            ctx?.drawImage( scanvas, 0, 0 )
            ctx?.drawImage( hcanvas, 0, 0 )
            window.requestAnimationFrame( move )
        } )()

        Html2Png.container.appendChild( canvas )
    }

}