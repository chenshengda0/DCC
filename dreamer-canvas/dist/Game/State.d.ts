declare class State {
    state: string;
    constructor(state: string);
}
declare class StandingLeft extends State {
    player: any;
    constructor(player: any);
    enter(): void;
    handleInput(input: string): void;
}
declare class StandingRight extends State {
    player: any;
    constructor(player: any);
    enter(): void;
    handleInput(input: string): void;
}
declare class SquatLeft extends State {
    player: any;
    constructor(player: any);
    enter(): void;
    handleInput(input: string): void;
}
declare class SquatRight extends State {
    player: any;
    constructor(player: any);
    enter(): void;
    handleInput(input: string): void;
}
declare class RunningLeft extends State {
    player: any;
    constructor(player: any);
    enter(): void;
    handleInput(input: string): void;
}
declare class RunningRight extends State {
    player: any;
    constructor(player: any);
    enter(): void;
    handleInput(input: string): void;
}
declare class RollLeft extends State {
    player: any;
    constructor(player: any);
    enter(): void;
    handleInput(input: string): void;
}
declare class RollRight extends State {
    player: any;
    constructor(player: any);
    enter(): void;
    handleInput(input: string): void;
}
declare class JumpLeft extends State {
    player: any;
    constructor(player: any);
    enter(): void;
    handleInput(input: string): void;
}
declare class JumpRight extends State {
    player: any;
    constructor(player: any);
    enter(): void;
    handleInput(input: string): void;
}
declare class FallingLeft extends State {
    player: any;
    constructor(player: any);
    enter(): void;
    handleInput(input: string): void;
}
declare class FallingRight extends State {
    player: any;
    constructor(player: any);
    enter(): void;
    handleInput(input: string): void;
}
export { StandingLeft, StandingRight, SquatLeft, SquatRight, RunningLeft, RunningRight, RollLeft, RollRight, JumpLeft, JumpRight, FallingLeft, FallingRight, };
