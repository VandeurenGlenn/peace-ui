export default class Client {
    #private;
    constructor();
    init(): Promise<void>;
    config(): Promise<void>;
    integrations(): Promise<void>;
    supportedIntegrations(): Promise<void>;
    addIntegration(integration: string, config: object): Promise<void>;
    changeIntegration(integration: string, config: object): Promise<void>;
    removeIntegration(integration: string): Promise<void>;
    interact(integration: string, id: string, action: string, value: string | number): Promise<void>;
    devices(): Promise<void>;
}
