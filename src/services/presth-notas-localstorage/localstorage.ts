import { dist, revDist } from './encryptionDict';

class PresthNotasLocalStorage {
    private static instance: PresthNotasLocalStorage;

    private constructor() {}

    public static getInstance(): PresthNotasLocalStorage {
        if (!PresthNotasLocalStorage.instance) {
            PresthNotasLocalStorage.instance = new PresthNotasLocalStorage();
        }

        return PresthNotasLocalStorage.instance;
    }

    public set(itemName: string, value: string) {
        return localStorage.setItem(itemName, value);
    }

    public get(itemName: string) {
        return localStorage.getItem(itemName);
    }

    public remove(itemName: string) {
        return localStorage.removeItem(itemName);
    }

    private encrypt(data: string) {
        return data.split('').map((_c: any) => dist[_c]).join('');
    }

    private decrypt(data: string | null) {
        return data?.split('').map((_c: any) => revDist[_c]).join('');
    }
}

export const PNLStorage = PresthNotasLocalStorage.getInstance();