import {
    Upload,
    Download,
    runtimeDecorator,
} from "../Common"

export default class Encryption{
    private static contianer: any;
    private static offset: any;

    constructor(domID:string){
        Encryption.contianer = document.getElementById( domID )
        Encryption.offset = Encryption.contianer.getBoundingClientRect()
    }

    render(enColor:string = "#000007"){
        //检查密钥是否符合规范
        if( !/^#[0-9a-f]{6}$/i.test( enColor ) ){
            throw new Error( "密钥必须为16进制颜色值！～" )
        }
        const keys = new Proxy( function*(){
            const Arr = Array.from( enColor )
            while( Arr.length >= 2 ){
                yield parseInt( `0x${Arr.splice( 1, 2 ).join( "" )}` )
            }
        }, {
            apply(...args){
                const GEN = Reflect.apply( ...args )
                const ANS = [...GEN]
                console.log( ANS )
                return ANS
            }
        } )() as unknown as number[];
        //设置主canvas
        const canvas = document.createElement( "canvas" )
        const ctx = canvas.getContext( "2d" )
        const W = canvas.width = Encryption.contianer.clientWidth;
        const H = canvas.height = Encryption.contianer.clientHeight;

        //设置操作面板
        const hcanvas = document.createElement( "canvas" )
        const hctx = hcanvas.getContext( "2d" )
        hcanvas.width = W;
        hcanvas.height = H;
        const upload = new Upload(W, H, Encryption.offset).draw( hctx )
        const download = new Download(W, H, Encryption.offset).draw( hctx )

        //设置显示面板
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
                                    tctx?.restore()
                                    const metaData:any = tctx?.getImageData( 0, 0, W ,H )
                                    new Proxy( function*(){
                                        for( let i = 0; i < metaData.data.length; ++i ){
                                            yield i;
                                        }
                                    },{
                                        apply(...args){
                                            const GEN = Reflect.apply( ...args )
                                            for( const i of GEN ){
                                                switch( true ){
                                                    case i % 4 === 0:
                                                            //@ts-ignore
                                                            metaData.data[i] = metaData.data[i] ^ (i % 256) ^ ENG[keys[1]] ^ ENB[keys[2]];
                                                        break;
                                                    case i % 4 === 1:
                                                            //@ts-ignore
                                                            metaData.data[i] = metaData.data[i] ^ (i % 256) ^ ENR[keys[0]] ^ ENB[keys[2]];
                                                        break;
                                                    case i % 4 === 2:
                                                            //@ts-ignore
                                                            metaData.data[i] = metaData.data[i] ^ (i %  256) ^ ENR[keys[0]] ^ ENG[keys[1]];
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }
                                        }
                                    } )()
                                    sctx?.clearRect( 0, 0, W, H )
                                    sctx?.save()
                                    sctx?.putImageData( metaData, 0, 0 )
                                    sctx?.restore()
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
                    const x = e.x - Encryption.offset.left
                    const y = e.y - Encryption.offset.top
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

        ;(function move(){
            ctx?.clearRect(0, 0, W, H)
            ctx?.drawImage( scanvas, 0, 0 )
            ctx?.drawImage( hcanvas, 0, 0 )
            window.requestAnimationFrame( move )
        })()

        Encryption.contianer.appendChild( canvas )
    }
}