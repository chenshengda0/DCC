import {
    Download,
    Upload,
    ScaleUp,
    ScaleDown,
    runtimeDecorator,
} from "../Common"

class ShowImage{

    private static x:number;
    private static y:number;
    private static z:number = 0;
    private static f1:number = 200;
    private static width:number;
    private static height:number;
    private static iwidth:number;
    private static iheight:number;
    private static img:any = new Image();
    private static offset:any;

    constructor(width:number, height:number, offset: any){
        ShowImage.width = width;
        ShowImage.height = height;
        ShowImage.offset = offset;
        ShowImage.x = ShowImage.width / 2;
        ShowImage.y = ShowImage.height / 2;
        ShowImage.iwidth = ShowImage.width / 4;
        ShowImage.iheight = ShowImage.height / 4;
        return this;
    }

    draw( ctx:any ){
        //计算缩放比例
        const scale = ShowImage.f1 / ( ShowImage.f1 + ShowImage.z )
        ctx.clearRect( 0,  0, ShowImage.width, ShowImage.height )
        //ctx.fillStyle = "red";
        ctx.save()
        ctx.translate( ShowImage.x, ShowImage.y )
        ctx.scale( scale, scale )
        ctx.beginPath()
        ctx.rect(-ShowImage.iwidth / 2, -ShowImage.iheight / 2, ShowImage.iwidth, ShowImage.iheight )
        ctx.closePath()
        //ctx.fill()
        ctx.clip()
        ctx.drawImage( ShowImage.img, 0, 0, ShowImage.img.width, ShowImage.img.height, -ShowImage.iwidth / 2, -ShowImage.iheight / 2, ShowImage.iwidth, ShowImage.iheight )
        ctx.restore()
        return this;
    }

    setImg(img:any){
        ShowImage.img = img;
        //重置z
        ShowImage.z = 0;
        return this;
    }

    scaleUp(){
        if( ShowImage.z > -150 ){
            ShowImage.z -= 10;
        }
        //console.log( "放大: ", ShowImage.z )
        return this;
    }

    scaleDown(){
        if( ShowImage.z < 150 ){
            ShowImage.z += 10;
        }
        //console.log( "缩小: ", ShowImage.z )
        return this
    }

    //返回当前metaData
    download(ctx:any){
        //计算缩放比例
        const scale = ShowImage.f1 / ( ShowImage.f1 + ShowImage.z )
        //计算当前图片宽高
        const width = ShowImage.iwidth * scale;
        const height = ShowImage.iheight * scale;
        //计算metaData
        return ctx.getImageData( (ShowImage.width - width) / 2, (ShowImage.height - height) / 2, width, height )
    }

}

export default class Scale{

    private static container:any;
    private static offset:any;

    constructor(domID:string){
        Scale.container = document.getElementById( domID )
        Scale.offset = Scale.container.getBoundingClientRect()
        return this;
    }

    @runtimeDecorator()
    render(){
        //创建主画布
        const canvas = document.createElement( "canvas" )
        const ctx:any = canvas.getContext( "2d" )
        const W = canvas.width = Scale.container.clientWidth;
        const H = canvas.height = Scale.container.clientHeight;

        //创建显示画布
        const scanvas = document.createElement( "canvas" )
        const sctx:any = scanvas.getContext( "2d" )
        scanvas.width = W;
        scanvas.height = H;
        const show = new ShowImage( W, H, Scale.offset )

        //创建操作画布
        const hcanvas = document.createElement( "canvas" )
        const hctx:any = hcanvas.getContext( "2d" )
        hcanvas.width = Scale.container.clientWidth;
        hcanvas.height = Scale.container.clientHeight;
        const upload = new Upload( W, H, Scale.offset ).draw( hctx )
        const download = new Download( W, H, Scale.offset ).draw( hctx )
        const scaleUp = new ScaleUp( W, H, Scale.offset ).draw( hctx )
        const scaleDown = new ScaleDown( W, H, Scale.offset ).draw( hctx )

        canvas.addEventListener( "touchstart", function(e){
            switch( true ){
                case upload.inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    //创建fileinput
                    const input = document.createElement( "input" )
                    input.type = "file"
                    input.accept = "image/png,image/jpeg,image/webp,image/jpg"
                    input.multiple = false
                    input.addEventListener( "change", function(e){
                        //@ts-ignore
                        const file = e.target.files[0];
                        const f = new FileReader();
                        f.readAsDataURL( file )
                        f.addEventListener( "load", function(e){
                            const img = new Image()
                            img.src = String( e.target?.result );
                            img.addEventListener( "load", function(){
                                show.setImg( img )
                            } )
                        } )
                    } )
                    input.click()
                    break;
                case download.inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    const tmetaData:any = show.download( sctx );
                    const tcanvas = document.createElement( "canvas" )
                    const tctx = tcanvas.getContext( "2d" )
                    tcanvas.width = tmetaData.width;
                    tcanvas.height = tmetaData.height;
                    tctx?.putImageData( tmetaData, 0, 0 )
                    tcanvas.toBlob( function(blob:any){
                        const blobURL = URL.createObjectURL( blob )
                        window.dispatchEvent( new CustomEvent( "dream_canvas_save_img", {
                            detail: {
                                blobURL,
                            }
                        } ) )
                    } )
                    break;
                case scaleUp.inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    show.scaleUp()
                    break;
                case scaleDown.inArea( e.touches[0].pageX, e.touches[0].pageY ):
                    show.scaleDown()
                    break;
                default:
                    const x = (e.touches[0].pageX - Scale.offset.left) | 0
                    const y = (e.touches[0].pageY - Scale.offset.top) | 0
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
            show.draw( sctx )
            ctx.drawImage( scanvas, 0, 0 )
            ctx.drawImage( hcanvas, 0, 0 )
            window.requestAnimationFrame( move )
        } )()

        Scale.container.appendChild( canvas )

    }

}