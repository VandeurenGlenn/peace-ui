import controller from 'niko-home-control';

class NikoHomeControl {
    static defaultOptions = {
        ip: '192.168.1.36',
        port: 8000,
        timeout: 20000,
        events: true
    };
    constructor(options = {}) {
        controller.init({ ...options, ...NikoHomeControl.defaultOptions });
    }
    async listLocations() { return controller.listLocations(); }
    async listActions() { return controller.listActions(); }
    async listEnergy() { return controller.listEnergy(); }
    async executeAction(id, value) {
        try {
            await controller.executeActions(id, value);
        }
        catch (error) {
            console.error(error);
        }
    }
    async systemInfo() { return controller.systemInfo(); }
}

export { NikoHomeControl as default };
