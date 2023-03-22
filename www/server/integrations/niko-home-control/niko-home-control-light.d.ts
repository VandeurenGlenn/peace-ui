export default class NikoHomeControlLight {
    #private;
    constructor(executer: any, { id, data }: {
        id: any;
        data: any;
    });
    get state(): 0 | 1;
    get id(): string;
    on(brightness: any): void;
    off(): void;
    toggle(): void;
    sync({ id, data }: {
        id: any;
        data: any;
    }): void;
}
