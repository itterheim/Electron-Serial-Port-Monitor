import SerialPort from 'serialport';
import { IBackupData } from './IBackupData';
import { IReceivedData } from './IReceivedData';

export interface ISharedObject {
    ports: SerialPort.PortInfo[];
    headers: IReceivedData;
    data: IReceivedData[];
    backup: IBackupData[];
}
