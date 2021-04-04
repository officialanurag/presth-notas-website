import PresthNotasSocket from './presth-notas-socket/socket';
import { GLOBAL_APP_STATUS } from './../global';

class UsersService {
    private static instance: UsersService;
    private deviceType: string = 'desktop';

    public static getInstance(): UsersService {
        if (!UsersService.instance) {
            UsersService.instance = new UsersService();
        }

        return UsersService.instance;
    }

    private presthNotasSocket: PresthNotasSocket = PresthNotasSocket.getInstance()
    
    private constructor() {
        if (window.navigator.userAgent.includes('Mobile')) {
            this.deviceType = 'mobile';
        }

        GLOBAL_APP_STATUS.callMeWhenLive(this.updateSocketInstance);
    }

    public register(name: string, email: string, password: string, areTermsAndConditionsAccepted: boolean): void {
        const payload = {
            channel: "client",
            payload: {
                service: "register",
                payload: { name, email, password, areTermsAndConditionsAccepted }
            },
            userId: 'NEW_USER_REGISTERATION',
            deviceType: this.deviceType
        } 
        this.presthNotasSocket.send(JSON.stringify(payload));        
    }

    public login(email: string, password: string) {
        const payload = {
            channel: "client",
            payload: {
                service: "login",
                payload: { email, password }
            },
            userId: 'USER_LOGIN',
            deviceType: this.deviceType
        } 
        this.presthNotasSocket.send(JSON.stringify(payload)); 
    }

    public checkLoggedInUser(userId: string) {
        const payload = {
            channel: "client",
            payload: {
                service: "check_logged_in_user",
                payload: { email: userId }
            },
            userId: userId,
            deviceType: this.deviceType
        }
        this.presthNotasSocket.send(JSON.stringify(payload)); 
    }

    public subscribe(func: Function) {
        this.presthNotasSocket.subscribe('client', func);
    }

    /**
     * Need to convert to arrow function to access `presthNotasSocket`
     * in GLOBAL_APP_STATUS class.
     */
    private updateSocketInstance = () => {
        this.presthNotasSocket = PresthNotasSocket.getInstance();
    }
}

export const Users = UsersService.getInstance()