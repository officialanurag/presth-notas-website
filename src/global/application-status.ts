import { GlobalStatus } from "./IGlobalApp";

class ApplicationStatus {
    private static instance: ApplicationStatus;
    
    /**
     * Global properties to be used in application
     * Declare all properties here.
     */
    private isDatosServerConnected: boolean = false;
    private updateNetworkStatusBar: Function = function() {};
    private subscribedNetworkLiveUpdateRegister: {[key: string]: Function} = {};
    private subscribedNetworkNotLiveUpdateRegister: {[key: string]: Function} = {};

    public static getInstance(): ApplicationStatus {
        if (!ApplicationStatus.instance) {
            ApplicationStatus.instance = new ApplicationStatus();
        }

        return ApplicationStatus.instance;
    }

    private constructor() {}

    private notifySubscribers(status: boolean): void {
        if (status) {
            Object.values(this.subscribedNetworkLiveUpdateRegister).forEach(_subscriber => _subscriber());
        } else {
            Object.values(this.subscribedNetworkNotLiveUpdateRegister).forEach(_subscriber => _subscriber());
        }
    }

    public setServerStatus(status: boolean): void {
        this.isDatosServerConnected = status;
        this.updateNetworkStatusBar(status)
        this.notifySubscribers(status);
    }

    public getServerStatus(): GlobalStatus {
        return {
            isDatosServerConnected: this.isDatosServerConnected
        };
    }

    public setNetworkUpdateCallback(callback: Function) {
        this.updateNetworkStatusBar = callback;
    }

    public callMeWhenLive(callback: Function): void {
        this.subscribedNetworkLiveUpdateRegister[callback.name] = callback;
    }

    public callMeWhenNotLive(callback: Function): void {
        this.subscribedNetworkNotLiveUpdateRegister[callback.name] = callback;
    }
}

export const GLOBAL_APP_STATUS = ApplicationStatus.getInstance();