import PresthNotasSocket from './presth-notas-socket/socket';
import { GLOBAL_APP_STATUS } from './../global';

class ContentService {
    private static instance: ContentService;
    private deviceType: string = 'desktop';

    public static getInstance(): ContentService {
        if (!ContentService.instance) {
            ContentService.instance = new ContentService();
        }

        return ContentService.instance;
    }

    private presthNotasSocket: PresthNotasSocket = PresthNotasSocket.getInstance()
    
    private constructor() {
        if (window.navigator.userAgent.includes('Mobile')) {
            this.deviceType = 'mobile';
        }

        GLOBAL_APP_STATUS.callMeWhenLive(this.updateSocketInstance);
    }

    public fetchContent(userId: string): void {
        const payload = {
            channel: "content",
            payload: {
                service: "fetch_content",
                payload: {
                    userId: userId
                }
            },
            userId: userId,
            deviceType: this.deviceType
        } 
        this.presthNotasSocket.send(JSON.stringify(payload));        
    }

    public storeContent(userId: string, text: string) {
        const payload = {
            channel: "content",
            payload: {
                service: "write_content",
                payload: {
                    userId: userId,
                    text: text
                }
            },
            userId: userId,
            deviceType: this.deviceType
        } 
        this.presthNotasSocket.send(JSON.stringify(payload)); 
    }

    public subscribe(func: Function) {
        this.presthNotasSocket.subscribe('content', func);
    }

    /**
     * Need to convert to arrow function to access `presthNotasSocket`
     * in GLOBAL_APP_STATUS class.
     */
    private updateSocketInstance = () => {
        this.presthNotasSocket = PresthNotasSocket.getInstance();
    }
}

export const Content = ContentService.getInstance()