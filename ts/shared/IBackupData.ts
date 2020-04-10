import { IReceivedData } from './IReceivedData';

export interface IBackupData {
    savedAt: string;
    headers: IReceivedData;
    data: IReceivedData[];
}
