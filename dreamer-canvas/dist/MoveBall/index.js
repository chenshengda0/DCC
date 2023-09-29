var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Ball, runtimeDecorator, } from "../Common";
export default class MoveBall {
    constructor(idTab) {
        this.container = document.getElementById(idTab);
        this.offset = this.container.getBoundingClientRect();
    }
    render(r = 20, fillStyle = "red") {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const W = canvas.width = this.container.clientWidth;
        const H = canvas.height = this.container.clientHeight;
        const ball = new Ball({
            x: W / 2,
            y: H / 2,
            r,
            width: W,
            height: H,
            fillStyle,
        });
        const moveBall = (e) => {
            ball.x = e.x - this.offset.left;
            ball.y = e.y - this.offset.top;
        };
        //获取坐标
        canvas.addEventListener("mousedown", (e) => {
            e.preventDefault();
            if (ball.inBlock(e.x - this.offset.left, e.y - this.offset.top)) {
                canvas.addEventListener("mousemove", moveBall);
                canvas.addEventListener("mouseup", function (e) {
                    canvas.removeEventListener("mousemove", moveBall);
                }, { once: true });
            }
        });
        (function move() {
            window.requestAnimationFrame(move);
            ctx.clearRect(0, 0, W, H);
            ball.draw(ctx);
        })();
        this.container.appendChild(canvas);
        return;
    }
}
__decorate([
    runtimeDecorator()
], MoveBall.prototype, "render", null);
