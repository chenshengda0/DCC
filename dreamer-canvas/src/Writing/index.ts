import {
    Upload,
    Download,
    runtimeDecorator,
} from "../Common"

export default class Writing{

    private static container:any;
    private static offset:any;

    constructor(domID:string){
        Writing.container = document.getElementById( domID )
        Writing.offset = Writing.container.getBoundingClientRect()
    }

    @runtimeDecorator()
    render(){
        //主canvas
        const canvas = document.createElement( "canvas" )
        const ctx = canvas.getContext( "2d" )
        const W = canvas.width = Writing.container.clientWidth;
        const H = canvas.height = Writing.container.clientHeight;

        //面板canvas
        const hcanvas = document.createElement( "canvas" )
        const hctx = hcanvas.getContext( "2d" )
        hcanvas.width = W;
        hcanvas.height = H;
        const upload = new Upload( W, H, Writing.offset ).draw( hctx )
        const download = new Download( W, H, Writing.offset ).draw( hctx )

        //显示canvas
        const scanvas = document.createElement( "canvas" )
        const sctx:any = scanvas.getContext( "2d" )
        scanvas.width = W;
        scanvas.height = H;

        const move = function(e:any){
            sctx.lineTo( e.touches[0].pageX - Writing.offset.left, e.touches[0].pageY - Writing.offset.top )
            sctx.strokeStyle = '#000';
            sctx.stroke()
        }

        canvas.addEventListener( "touchstart", function(e){
            e.preventDefault()
            switch( true ){
                case upload.inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    sctx.clearRect( 0, 0, W, H )
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
                    sctx.beginPath()
                    sctx.lineTo( e.touches[0].pageX - Writing.offset.left, e.touches[0].pageY - Writing.offset.top )
                    canvas.addEventListener( "touchmove", move )
                    canvas.addEventListener( "touchend", ()=> canvas.removeEventListener( "touchmove", move ), {once: true} )
                    break;
            }

        } )


        ;( function move(){
            ctx?.clearRect( 0, 0, W, H )
            ctx?.drawImage( scanvas, 0, 0 )
            ctx?.drawImage( hcanvas, 0, 0 )
            window.requestAnimationFrame( move )
        } )()

        Writing.container.appendChild( canvas )
    }

}