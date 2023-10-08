type colorType = 'r' | 'g' | 'b';
export default class Monochrome {
    private static container;
    private static offset;
    constructor(domID: string);
    render(colorType?: colorType): void;
}
export {};
