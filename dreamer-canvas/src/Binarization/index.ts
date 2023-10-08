import {
    Upload,
    Download,
    runtimeDecorator
} from "../Common"

class ShowImage{

    private static width:number;
    private static height:number;
    private static x:number;
    private static y:number;
    private static img:any;
    private static key:string = "Binarization";

    constructor(width:number, height:number){
        ShowImage.width = width;
        ShowImage.height = height;
        ShowImage.x = 0;
        ShowImage.y = 0;
        ShowImage.img = new Image();
        return this;
    }

    draw(ctx:any){
        ctx.clearRect( 0, 0, ShowImage.width, ShowImage.height )
        ctx?.save()
        ctx?.translate( ShowImage.x, ShowImage.y )
        ctx?.drawImage( ShowImage.img, 0, 0, ShowImage.img.width, ShowImage.img.height, 0, 0, ShowImage.width, ShowImage.height )
        ctx?.restore()
        ShowImage.rewrite( ctx )
        return this;
    }

    setSrc(img:any){
        ShowImage.img = img;
        return this;
    }

    private static rewrite(ctx:any){
        const metaData:any = ctx?.getImageData( 0, 0, ShowImage.width, ShowImage.height )
        const indexParam = new Proxy( function*(){
            const indexData = [];
            for( let i = 0; i < metaData.data.length >> 2; ++i ){
                indexData.push( i )
            }
            indexData.reverse()
            while( indexData.length > 0 ){
                const currentData = []
                for( let i = 0; i < ShowImage.width; ++i ){
                    currentData.push( indexData.pop() )
                }
                yield currentData
            }
        }, {
            apply(...args){
                const GEN = Reflect.apply( ...args )
                const ANS = [...GEN]
                return ANS;
            }
        } )() as unknown as number[][];
        //根据indexParam 计算灰度
        const grayParam = JSON.parse( JSON.stringify( indexParam ) )
        for( let i = 0; i < indexParam.length; ++i ){
            for( let j = 0; j < indexParam[i].length; ++j ){
                const currentIndex = indexParam[i][j]
                const r = metaData.data[ (currentIndex<<2) + 0 ]
                const g = metaData.data[ (currentIndex<<2) + 1 ]
                const b = metaData.data[ (currentIndex<<2) + 2 ]
                const gray = (r * 0.3 + g * 0.59 + b * 0.11) | 0;
                grayParam[i][j] = gray;
            }
        }
        //计算平均值
        const aves = [];
        for( let i = 0; i < indexParam.length; ++i ){
            aves.push( grayParam[i].reduce( (prev:number,cur:number) => prev+=cur, 0 ) / grayParam[i].length )
        }
        const ave = aves.reduce( (prev:number, cur:number) => prev+=cur , 0 ) / aves.length | 0
        //修改图片
        for( let i = 0; i < indexParam.length; ++i ){
            for( let j = 0; j < indexParam[i].length; ++j ){
                const currentIndex = indexParam[i][j];
                metaData.data[ (currentIndex<<2) + 0 ] = grayParam[i][j] > ave ? 255 : 0;
                metaData.data[ (currentIndex<<2) + 1 ] = grayParam[i][j] > ave ? 255 : 0;
                metaData.data[ (currentIndex<<2) + 2 ] = grayParam[i][j] > ave ? 255 : 0;
                metaData.data[ (currentIndex<<2) + 3 ] = 255;
            }
        }
        ctx.putImageData( metaData, 0, 0 );
        return ;
    }

}


export default class Binarization{

    private static container:any;
    private static offset:any;
    private static db:any;

    constructor(domID:string){
        Binarization.container = document.getElementById( domID )
        Binarization.offset = Binarization.container.getBoundingClientRect()
    }


    @runtimeDecorator()
    render(){
        //创建主canvas
        const canvas = document.createElement( "canvas" )
        const ctx = canvas.getContext( "2d" )
        const W = canvas.width = Binarization.container.clientWidth;
        const H = canvas.height = Binarization.container.clientHeight;
        
        //创建操作canvas
        const hcanvas = document.createElement( "canvas" )
        const hctx = hcanvas.getContext( "2d" )
        hcanvas.width = W;
        hcanvas.height = H;

        //创建显示的canvas
        const scanvas = document.createElement( "canvas" )
        const sctx = scanvas.getContext( "2d" )
        scanvas.width = W;
        scanvas.height = H;

        //创建操作对象
        const upload = new Upload( W, H, Binarization.offset ).draw( hctx )
        const download = new Download( W, H, Binarization.offset ).draw( hctx )

        //创建显示对象
        const show = new ShowImage( W, H )

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
                                    show.setSrc( img );
                                    show.draw( sctx )
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
                    const x = e.x - Binarization.offset.left
                    const y = e.y - Binarization.offset.top
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
            ctx?.clearRect( 0, 0, W, H )
            ctx?.drawImage( scanvas, 0, 0 )
            ctx?.drawImage( hcanvas, 0, 0 )
            window.requestAnimationFrame( move )
        } )()

        Binarization.container.appendChild( canvas )
    }

}
