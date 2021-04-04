import { PNLStorage } from "../services/presth-notas-localstorage";
import { GlobalStatus } from "./IGlobalApp";

class ApplicationStatus {
    private static instance: ApplicationStatus;
    
    /**
     * Global properties to be used in application
     * Declare all properties here.
     */
    private enableProject: boolean = false;
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
        if (this.enableProject) {
            this.updateNetworkStatusBar(status)
            this.notifySubscribers(status);
        }
    }

    public isUserLoggedIn(): boolean {
        let isUserLoggedIn = false;
        if (PNLStorage.get('_ui') && PNLStorage.get('_un')) {
            isUserLoggedIn = true;
        }

        return isUserLoggedIn;
    }

    public getServerStatus(): GlobalStatus {
        return {
            isDatosServerConnected: this.enableProject ? this.isDatosServerConnected : this.enableProject,
            isEnbaleProject: this.enableProject
        };
    }

    public setApplicationReadyStatus(status: boolean): void {
        this.enableProject = status;
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