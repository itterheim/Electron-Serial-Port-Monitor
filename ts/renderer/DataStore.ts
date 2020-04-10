import { IBackupData } from '../shared/IBackupData';
import { IReceivedData } from '../shared/IReceivedData';
import { NumericData } from './NumericData';

export class DataStore {
    public static ports: string[] = [];
    public static headers: IReceivedData;
    public static data: IReceivedData[] = [];
    public static backupData: IBackupData[] = [];

    public static numericData = new NumericData();

    public static backup () {
        this.backupData.push({
            savedAt: new Date().toISOString(),
            headers: DataStore.headers,
            data: DataStore.data
        });
    }
}
