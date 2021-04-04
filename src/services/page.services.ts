import PresthNotasSocket from './presth-notas-socket/socket';
import { GLOBAL_APP_STATUS } from './../global';

class PageService {
    private static instance: PageService;
    private deviceType: string = 'desktop';

    public static getInstance(): PageService {
        if (!PageService.instance) {
            PageService.instance = new PageService();
        }

        return PageService.instance;
    }

    private presthNotasSocket: PresthNotasSocket = PresthNotasSocket.getInstance()
    
    private constructor() {
        if (window.navigator.userAgent.includes('Mobile')) {
            this.deviceType = 'mobile';
        }

        GLOBAL_APP_STATUS.callMeWhenLive(this.updateSocketInstance);
    }

    public addPage(userId: string, pageId: string, pageTitle: string) {
        const payload = {
            channel: "page",
            payload: {
                service: "add_page",
                payload: {
                    userId: userId,
                    localPageId: pageId,
                    pageTitle: pageTitle
                }
            },
            userId: userId,
            deviceType: this.deviceType
        } 
        this.presthNotasSocket.send(JSON.stringify(payload)); 
    }

    public getPageList(userId: string) {
        const payload = {
            channel: "page",
            payload: {
                service: "get_pages",
                payload: {
                    userId: userId
                }
            },
            userId: userId,
            deviceType: this.deviceType
        } 
        this.presthNotasSocket.send(JSON.stringify(payload)); 
    }

    public setActivePage(userId: string, pageId: string) {
        const payload = {
            channel: "page",
            payload: {
                service: "set_current_page",
                payload: {
                    userId: userId,
                    pageId: pageId
                }
            },
            userId: userId,
            deviceType: this.deviceType
        } 
        this.presthNotasSocket.send(JSON.stringify(payload)); 
    }

    public removePage(userId: string, pageId: string) {
        const payload = {
            channel: "page",
            payload: {
                service: "remove_page",
                payload: {
                    userId: userId,
                    pageId: pageId
                }
            },
            userId: userId,
            deviceType: this.deviceType
        } 
        this.presthNotasSocket.send(JSON.stringify(payload)); 
    }

    public subscribe(func: Function) {
        this.presthNotasSocket.subscribe('page', func);
    }

    /**
     * Need to convert to arrow function to access `presthNotasSocket`
     * in GLOBAL_APP_STATUS class.
     */
    private updateSocketInstance = () => {
        this.presthNotasSocket = PresthNotasSocket.getInstance();
    }
}

export const PageNote = PageService.getInstance()