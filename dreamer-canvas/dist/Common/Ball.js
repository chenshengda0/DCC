var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { runtimeDecorator, } from "./utils";
export default class Ball {
    constructor(props) {
        this.x = 0;
        this.y = 0;
        this.r = 30;
        this.width = 0;
        this.height = 0;
        this.fillStyle = "red";
        Object.assign(this, props);
        return this;
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.fillStyle;
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        return this;
    }
    inBlock(x, y) {
        return Math.sqrt(Math.pow((x - this.x), 2) + Math.pow((y - this.y), 2)) < this.r;
    }
}
__decorate([
    runtimeDecorator()
], Ball.prototype, "inBlock", null);
