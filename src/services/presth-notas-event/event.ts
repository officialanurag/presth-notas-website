class PresthNotasEvent {
    private static instance: PresthNotasEvent;
    private eventRegister: {[key: string]: Function} = {};

    private constructor() {}

    public static getInstance(): PresthNotasEvent {
        if (!PresthNotasEvent.instance) {
            PresthNotasEvent.instance = new PresthNotasEvent();
        }

        return PresthNotasEvent.instance;
    }

    public register(eventName: string, listener: Function) {
        this.eventRegister[eventName] = listener;
    }

    public emit(eventName: string, payload: any) {
        if (this.eventRegister[eventName]) {
            this.eventRegister[eventName](payload);
        }
    }
}

export const PNEvent = PresthNotasEvent.getInstance();