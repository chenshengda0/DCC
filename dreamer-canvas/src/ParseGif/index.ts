import {
    Upload,
    Download,
    runtimeDecorator,
} from "../Common"
import {Parser} from "@n.see/gif-parser"

class ShowImage{

    private static width:number;
    private static height:number;
    private static x:number = 0;
    private static y:number = 0;
    private static img:any = new Image();
    private static offset:any;

    constructor(width:number, height:number, offset:any){
        ShowImage.width = width;
        ShowImage.height = height;
        ShowImage.offset = offset;
        return this;
    }

    draw(ctx:any){
        ctx.save()
        console.log( ShowImage.img.width )
        ctx.drawImage( ShowImage.img, 0, 0, ShowImage.img.width, ShowImage.img.height, 0, 0, ShowImage.width, ShowImage.height )
        ctx.restore()
        return this;
    }

    initImg(img:any){
        ShowImage.img = img;
        return this;
    }

}

export default class ParseGif{

    private static container:any;
    private static offset:any;


    constructor(domID:string){
        ParseGif.container = document.getElementById( domID )
        ParseGif.offset = ParseGif.container.getBoundingClientRect()
    }

    @runtimeDecorator()
    render(){
        //主canvas
        const canvas = document.createElement( "canvas" )
        const ctx = canvas.getContext( "2d" )
        const W = canvas.width = ParseGif.container.clientWidth;
        const H = canvas.height = ParseGif.container.clientHeight;

        //显示canvas
        const scanvas = document.createElement( "canvas" )
        const sctx = scanvas.getContext( "2d" )
        // scanvas.width = W;
        // scanvas.height = H;

        const show = new ShowImage( W, H, ParseGif.offset );

        //面板canvas
        const hcanvas = document.createElement( "canvas" )
        const hctx = hcanvas.getContext( "2d" )
        hcanvas.width = W;
        hcanvas.height = H;
        const upload = new Upload( W, H, ParseGif.offset ).draw( hctx )
        const download = new Download( W, H, ParseGif.offset ).draw( hctx )

        canvas.addEventListener( "click", function(e){
            switch( true ){
                case upload.inArea( e.x, e.y ):
                    const input = document.createElement( "input" )
                    input.type = "file"
                    input.accept = "image/gif"
                    input.multiple = false
                    input.addEventListener( "change", async function(e){
                        //@ts-ignore
                        const file = e.target.files[0];
                        if( !file ) return ;
                        const fr = new FileReader()
                        fr.readAsArrayBuffer( file )
                        fr.addEventListener( "load", function(e){
                            const buff = e.target?.result
                            const parser = new Parser( buff )

                            //gif 宽高
                            const [width, height ] = parser.getSize()
                            //导出数据
                            parser.export();
                            const frames = parser.getFrames();
                            //创建画布
                            const tcanvas = document.createElement( "canvas" )
                            const tctx = tcanvas.getContext( "2d" )
                            tcanvas.width = width * frames.length;
                            tcanvas.height = height;
                            for( let i = 0; i < frames.length; ++i ){
                                tctx?.putImageData( frames[i].imageData, i*width, 0 )
                            }
                            scanvas.height = height;
                            scanvas.width = width * frames.length;
                            sctx?.drawImage( tcanvas, 0, 0 )
                        } )
                    } )
                    input.click();
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
                    break;
            }
        } )

        //动画
        ;( function move(){
            ctx?.clearRect( 0, 0, W, H )
            //show.draw( sctx )
            ctx?.drawImage( scanvas, 0, 0 )
            ctx?.drawImage( hcanvas, 0, 0 )
            window.requestAnimationFrame( move )
        } )()

        ParseGif.container.appendChild( canvas );
    }


}