declare class NikoHomeControl {
    static defaultOptions: {
        ip: string;
        port: number;
        timeout: number;
        events: boolean;
    };
    constructor(options?: {});
    listLocations(): Promise<any>;
    listActions(): Promise<any>;
    listEnergy(): Promise<any>;
    executeAction(id: string, value: string): Promise<void>;
    systemInfo(): Promise<any>;
}
export { NikoHomeControl as default };
