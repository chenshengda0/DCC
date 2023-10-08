export default class Hollow {
    private static container;
    private static offset;
    constructor(domID: string);
    render(message?: string, fontSize?: number, changeFrame?: number): Promise<void>;
}
