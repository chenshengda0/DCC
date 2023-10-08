import {
    Upload,
    Download,
    runtimeDecorator,
} from "../Common"

class ShowImage{
    private static width:number;
    private static height:number;
    private static x:number;
    private static y:number;
    private static R:number;
    private static img:any;
    private static diffX:number;
    private static diffY:number;
    private static offset:any;

    constructor(width:number, height:number, offset:any){
        ShowImage.width = width;
        ShowImage.height = height;
        ShowImage.x = ShowImage.width / 2;
        ShowImage.y = ShowImage.height / 2;
        ShowImage.R = ShowImage.width <= ShowImage.height ? ShowImage.width : ShowImage.height;
        ShowImage.img = new Image()
        ShowImage.diffX = 0;
        ShowImage.diffY = 0;
        ShowImage.offset = offset
        return this;
    }

    setSrc(img:any){
        ShowImage.img = img;
        return this;
    }

    draw(ctx:any){
        ctx.clearRect( 0, 0, ShowImage.width, ShowImage.height )
        //裁剪区域
        ctx.save()
        ctx.fillStyle = "rgba(0,0,0,0.5)"
        //ctx.fill()
        ctx.beginPath()
        ctx.rect( ShowImage.x - ShowImage.R / 2, ShowImage.y - ShowImage.R / 2, ShowImage.R, ShowImage.R )
        ctx.closePath()
        ctx.fill()
        ctx.clip()
        ctx.drawImage( ShowImage.img, 0, 0, ShowImage.img.width, ShowImage.img.height, 0, 0, ShowImage.width, ShowImage.height )
        ctx.restore()
        return this;
    }

    initDiff(currentX:number , currentY:number){
        ShowImage.diffX = currentX - ShowImage.offset.left - ShowImage.x;
        ShowImage.diffY = currentY - ShowImage.offset.top - ShowImage.y;
        return this;
    }

    inArea( x: number, y:number ){
        //计算对于中点相对坐标取绝对值
        const xAxios = Math.abs( x - ShowImage.offset.left - ShowImage.x );
        const yAxios = Math.abs( y - ShowImage.offset.top - ShowImage.y );
        return xAxios <= ShowImage.R / 2 && yAxios <= ShowImage.R / 2;
    }

    onMove(e:any){
        console.log( e )
        //计算当前中心点坐标
        ShowImage.x = e.touches[0].pageX - ShowImage.offset.left - ShowImage.diffX;
        ShowImage.y = e.touches[0].pageY - ShowImage.offset.top - ShowImage.diffY;
        //左边界
        if( ShowImage.x - 1/2*ShowImage.R <= 0 ){
            ShowImage.x = 1/2*ShowImage.R;
        }
        //右边界
        if( ShowImage.x + 1/2*ShowImage.R >= ShowImage.width ){
            ShowImage.x = ShowImage.width - 1/2*ShowImage.R;
        }
        //上边界
        if( ShowImage.y - 1/2*ShowImage.R <= 0 ){
            ShowImage.y = 1/2*ShowImage.R;
        }
        //下边界
        if( ShowImage.y + 1/2*ShowImage.R >= ShowImage.height ){
            ShowImage.y = ShowImage.height - 1/2*ShowImage.R;
        }
        return this;
    }

    //获取clip 区域metaData
    getMetaData(ctx:any){
        //计算矩形坐标
        const x = ShowImage.x - 1/2*ShowImage.R
        const y = ShowImage.y - 1/2*ShowImage.R
        return {
            R: ShowImage.R,
            metaData: ctx.getImageData( x, y, ShowImage.R, ShowImage.R )
        }
    }
}

export default class Clip{
    private static container:any;
    private static offset:any;

    constructor(domID:string){
        Clip.container = document.getElementById( domID )
        Clip.offset = Clip.container.getBoundingClientRect()
    }

    @runtimeDecorator()
    render(){
        //创建主canvas
        const canvas = document.createElement( "canvas" )
        const ctx = canvas.getContext( "2d" )
        const W = canvas.width = Clip.container.clientWidth;
        const H = canvas.height = Clip.container.clientHeight;

        //创建显示的canvas
        const scanvas = document.createElement( "canvas" )
        const sctx = scanvas.getContext( "2d" )
        scanvas.width = W;
        scanvas.height = H;

        const show = new ShowImage( W, H, Clip.offset )

        //创建操作canvas
        const hcanvas = document.createElement( "canvas" )
        const hctx = hcanvas.getContext( "2d" )
        hcanvas.width = W;
        hcanvas.height = H;
        //创建操作元素
        const upload = new Upload( W, H, Clip.offset).draw( hctx )
        const download = new Download( W, H, Clip.offset ).draw( hctx )

        canvas.addEventListener( "touchstart", function(e){
            //初始化偏移量
            show.initDiff( e.touches[0].pageX, e.touches[0].pageY )
            switch( true ){
                //上传
                case upload.inArea( e.touches[0].pageX, e.touches[0].pageY ):
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
                                    show.setSrc( img )
                                } )
                            }
                        }
                    } )
                    file.click();
                    break;
                //下载
                case download.inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    const param = show.getMetaData( sctx )
                    //设置临时canvs
                    const tcanvas = document.createElement( "canvas" )
                    const tctx = tcanvas.getContext( "2d" )
                    tcanvas.width = param.R;
                    tcanvas.height = param.R;
                    //put数据
                    tctx?.putImageData( param.metaData, 0, 0 )
                    tcanvas.toBlob( function(blob:any){
                        const blobURL = URL.createObjectURL( blob )
                        window.dispatchEvent( new CustomEvent( "dream_canvas_save_img", {
                            detail: {
                                blobURL,
                            }
                        } ) )
                    } )
                    break;
                case show.inArea( e.touches[0].pageX, e.touches[0].pageY  ):
                    canvas.addEventListener( "touchmove", show.onMove )
                    canvas.addEventListener( "touchend", ()=> canvas.removeEventListener( "touchmove", show.onMove ), {once: true} )
                    break;
                default:
                    break;
            }
        } )

        ;( function move(){
            ctx?.clearRect( 0, 0, W, H )
            show.draw( sctx )
            ctx?.drawImage( scanvas, 0, 0 )
            ctx?.drawImage( hcanvas, 0, 0 )
            window.requestAnimationFrame( move )
        } )()

        Clip.container.appendChild( canvas )
    }
}