import { GLOBAL_APP_STATUS } from '../../global';

/**
 * Constants Registeration
 * Connection: WS
 * Client ID
 * Try Service Instance
 * Service Response Instance
 */

class PresthNotasSocket {
    private static instance: PresthNotasSocket;

    private connString: string = 'ws://139.59.28.198:4000/';
    private connection: WebSocket = {} as any;
    private status = {
        isConnected: false
    };
    private subscribedComponents: {[key: string]: Function} = { };

    private constructor() {
        this.initProcess();
    }

    public static getInstance(): PresthNotasSocket {
        if (!PresthNotasSocket.instance) {
            PresthNotasSocket.instance = new PresthNotasSocket();
        }

        return PresthNotasSocket.instance;
    }

    private initProcess () {
        try {
            this.connection = new WebSocket(this.connString, 'echo-protocol');

            this.connection.onopen = (e) => {        
                console.log('%c Connection Established Successfully.', 'color: green');
                this.status.isConnected = true;
                GLOBAL_APP_STATUS.setServerStatus(true);
            }
            
            this.connection.onmessage = e => {    
                try {
                    const data = JSON.parse(e.data);
                    if (this.subscribedComponents[data.channel]) {
                        this.subscribedComponents[data.channel](data)
                    }       
                } catch (e) {
                    console.log(e.message)
                }
            }

            this.connection.onclose = e => {
                this.status.isConnected = false;
                GLOBAL_APP_STATUS.setServerStatus(false);
                this.restartConnection();
            }
        } catch(error) {
            console.log("Error")
        }
    }

    private restartConnection (): void {
        if (!this.status.isConnected && this.connection.readyState !== 0) {
            PresthNotasSocket.instance = new PresthNotasSocket(); 
        }
    }

    public send(payload: any) {
        if (this.status.isConnected) {
            this.connection.send(payload)
        }
    }

    public subscribe(channel: string, func: Function) {
        if (!this.subscribedComponents[channel]) {
            this.subscribedComponents[channel] = func;
        }
    }
}


export default PresthNotasSocket;