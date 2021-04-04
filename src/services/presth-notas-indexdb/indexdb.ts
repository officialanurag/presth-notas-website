class PresthNotasIndexedDB {
    private static instance: PresthNotasIndexedDB;
    private request: any;
    private notas: any;

    private constructor() {
        this.connect();
    }

    public static getInstance(): PresthNotasIndexedDB {
        if (!PresthNotasIndexedDB.instance) {
            PresthNotasIndexedDB.instance = new PresthNotasIndexedDB();
        }

        return PresthNotasIndexedDB.instance;
    }

    private connect() {
        this.request = indexedDB.open('presth');
        if (this.request) {
            this.request.onupgradeneeded = this.onupgradeneeded;
            this.request.onsuccess = this.onsuccess;
        }
    }

    private onupgradeneeded = () => {
        console.log('onupgradeneeded');
        const db = this.request.result;
        if (!db.objectStoreNames.contains('notas')) {
            const store = db.createObjectStore('notas', {keyPath: 'id'});
            store.put({id: 'text', content: '~EMPTY~'});
        }
    }

    private onsuccess = () => {
        if (this.request) {
            const db = this.request.result;
            db.onerror = this.onDBError;
        }
    }

    private onDBError = (event: any) => {
        console.log('Error ::', this.request.error);
    }

    public writeContent = (text: string) => {
        if (this.request) {
            const db = this.request.result;
            const tx = db.transaction('notas', 'readwrite');
            this.notas = tx.objectStore('notas');
            tx.oncomplete = this.onTransactionComplete;
            
            const note = {
                id: 'text',
                content: text
            };

            const notasResponse = this.notas.put(note);
            notasResponse.onsuccess = this.notasReponseOnSuccess;
            notasResponse.onerror = this.notasReponseOnError;
        }
    }

    public fetchContent = (callback: Function) => {
        if (this.request) {
            const db = this.request.result;
            const tx = db.transaction('notas', 'readwrite');
            const notas = tx.objectStore('notas');
            const req = notas.get('text')
            req.onsuccess = (event: any) => {
                callback(req.result.content)
            };
            req.onerror = this.onFetchRequestError;
        }
    }

    private notasReponseOnSuccess = (notasResponse: any) => {}
    private notasReponseOnError = (notasResponse: any) => {}
    private onTransactionComplete = () => {}
    private onFetchRequestError = () => {}
}

export const PNIndexedDB = PresthNotasIndexedDB;