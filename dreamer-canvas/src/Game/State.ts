const states = {
    STADING_LEFT: 0,
    STADING_RIGHT: 1,
    SQUAT_LEFT: 2,
    SQUIT_RIGHT:3,
    RUNNING_LEFT: 4,
    RUNNING_RIGHT: 5,
    ROLL_LEFT: 6,
    ROLL_RIGHT: 7,
    JUMP_LEFT: 8,
    JUMP_RIGHT: 9,
    FALLING_LEFT: 10,
    FALLING_RIGHT: 11,
}

class State{
    state:string;
    constructor(state:string){
        this.state = state;
    }
}

class StandingLeft extends State{
    player:any;
    constructor(player:any){
        super("向左站立")
        this.player = player;
    }

    enter(){
        this.player.frameY = 1
        this.player.vx = 0
        this.player.maxframe = 7
        this.player.vy = 0
    }

    handleInput(input:string){
        //console.log( this.player )
        switch(true){
            case input === "ENTER LEFT":
                this.player.setState( states.RUNNING_LEFT )
                break;
            case input === "ENTER RIGHT":
                this.player.setState( states.STADING_RIGHT )
                break;
            case input === "ENTER DOWN":
                this.player.setState( states.SQUAT_LEFT )
                break;
            case input === "ENTER UP":
                this.player.setState( states.JUMP_LEFT )
                break;
            default:
                break;
        }
    }
}

class StandingRight extends State{
    player:any;
    constructor(player:any){
        super("向右站立")
        this.player = player;
    }

    enter(){
        this.player.frameY = 0
        this.player.vx = 0
        this.player.maxframe = 7
        this.player.vy = 0
    }

    handleInput(input:string){
        switch(true){
            case input === "ENTER RIGHT":
                this.player.setState( states.RUNNING_RIGHT )
                break;

            case input === "ENTER LEFT":
                //console.log( "设置向左站立" )
                this.player.setState( states.STADING_LEFT )
                break;

            case input === "ENTER DOWN":
                this.player.setState( states.SQUIT_RIGHT )
                break;

            case input === "ENTER UP":
                this.player.setState( states.JUMP_RIGHT )
                break;
            default:
                break;
        }
    }
}

class SquatLeft extends State{
    player:any;
    constructor(player:any){
        super("左蹲")
        this.player = player;
    }

    enter(){
        this.player.frameY = 9
        this.player.vx = 0
        this.player.maxframe = 5
        this.player.vy = 0
    }

    handleInput(input:string){
        switch(true){
            case input === "ENTER UP":
                this.player.setState( states.STADING_LEFT )
                break;
            case input === "ENTER LEFT":
                this.player.setState( states.ROLL_LEFT )
                break;
            case input === "ENTER RIGHT":
                this.player.setState( states.SQUIT_RIGHT )
                break;
            default:
                break;
        }
    }
}

class SquatRight extends State{
    player:any;
    constructor(player:any){
        super("右蹲")
        this.player = player;
    }

    enter(){
        this.player.frameY = 8
        this.player.vx = 0
        this.player.maxframe = 5
        this.player.vy = 0
    }

    handleInput(input:string){
        //console.log( this.player )
        switch(true){
            case input === "ENTER UP":
                this.player.setState( states.STADING_RIGHT )
                break;
            case input === "ENTER RIGHT":
                this.player.setState( states.ROLL_RIGHT )
                break;
            case input === "ENTER LEFT":
                this.player.setState( states.SQUAT_LEFT )
                break;
            default:
                break;
        }
    }
}

class RunningLeft extends State{
    player:any;
    constructor(player:any){
        super("左运动")
        this.player = player;
    }

    enter(){
        this.player.frameY = 7
        this.player.vx = -5;
        this.player.maxframe = 9
        this.player.vy = 0
    }

    handleInput(input:string){
        switch(true){
            case input === "ENTER RIGHT":
                this.player.setState( states.RUNNING_RIGHT )
                break;
            case input === "RELEASE LEFT":
                this.player.setState( states.STADING_LEFT )
                break;
            case input === "ENTER DOWN":
                this.player.setState( states.SQUAT_LEFT )
                break;
            default:
                break;
        }
    }
}

class RunningRight extends State{
    player:any;
    constructor(player:any){
        super("右运动")
        this.player = player;
    }

    enter(){
        this.player.frameY = 6
        this.player.vx = 5;
        this.player.maxframe = 9
        this.player.vy = 0
    }

    handleInput(input:string){
        switch(true){
            case input === "ENTER LEFT":
                this.player.setState( states.RUNNING_LEFT )
                break;
            case input === "RELEASE RIGHT":
                this.player.setState( states.STADING_RIGHT )
                break;
            case input === "ENTER DOWN":
                this.player.setState( states.SQUAT_LEFT )
                break;
            default:
                break;
        }
    }
}

class RollLeft extends State{
    player:any
    constructor(player:any){
        super("左滚")
        this.player = player;
    }

    enter(){
        this.player.frameY = 11
        this.player.vx = -5;
        this.player.maxframe = 7
        this.player.vy = 0
    }

    handleInput(input:string){
        switch(true){
            case input === "RELEASE LEFT":
                this.player.setState( states.STADING_LEFT )
                break;
            default:
                break;
        }
    }
}

class RollRight extends State{
    player:any
    constructor(player:any){
        super("右滚")
        this.player = player;
    }

    enter(){
        this.player.frameY = 10
        this.player.vx = 5;
        this.player.maxframe = 7
        this.player.vy = 0
    }

    handleInput(input:string){
        switch(true){
            case input === "RELEASE RIGHT":
                this.player.setState( states.STADING_RIGHT )
                break;
            default:
                break;
        }
    }
}

class JumpLeft extends State{
    player:any;
    constructor(player:any){
        super("左上跳")
        this.player = player;
    }

    enter(){
        this.player.frameY = 3
        this.player.vx = -5;
        this.player.maxframe = 7
        if( this.player.onGround() ) this.player.vy = -15;
    }

    handleInput(input:string){
        switch(true){
            case input === "ENTER RIGHT":
                this.player.setState( states.JUMP_RIGHT )
                break;
            case this.player.onGround():
                this.player.setState( states.STADING_LEFT )
                break;
            case this.player.vy > this.player.g:
                this.player.setState( states.FALLING_LEFT )
                break;
            default:
                break;
        }
    }
}

class JumpRight extends State{
    player:any;
    constructor(player:any){
        super("右上跳")
        this.player = player;
    }

    enter(){
        this.player.frameY = 2
        this.player.vx = 5;
        this.player.maxframe = 7
        if( this.player.onGround() ) this.player.vy = -15
    }

    handleInput(input:string){
        switch(true){
            case input === "ENTER LEFT":
                this.player.setState( states.JUMP_LEFT )
                break;
            case this.player.onGround():
                this.player.setState( states.STADING_RIGHT )
                break;
            case this.player.vy > this.player.g:
                this.player.setState( states.FALLING_RIGHT )
                break;
            default:
                break;
        }
    }
}

class FallingLeft extends State{
    player:any
    constructor(player:any){
        super("左下落")
        this.player = player;
    }

    enter(){
        this.player.frameY = 5
    }

    handleInput(input:string){
        switch(true){
            case input === "ENTER RIGHT":
                this.player.setState( states.FALLING_RIGHT )
                break;
            case this.player.onGround():
                //console.log( "到底了" )
                this.player.setState( states.STADING_LEFT )
                break;
            default:
                break;
        }
    }
}

class FallingRight extends State{
    player:any;
    constructor(player:any){
        super("右下落")
        this.player = player;
    }

    enter(){
        this.player.frameY = 4
    }

    handleInput(input:string){
        switch(true){
            case input === "ENTER LEFT":
                this.player.setState( states.FALLING_LEFT )
                break;
            case this.player.onGround():
                //console.log( "到底了" )
                this.player.setState( states.STADING_RIGHT )
                break;
            default:
                break;
        }
    }
}

export {
    StandingLeft,
    StandingRight,
    SquatLeft,
    SquatRight,
    RunningLeft,
    RunningRight,
    RollLeft,
    RollRight,
    JumpLeft,
    JumpRight,
    FallingLeft,
    FallingRight,
}