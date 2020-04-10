import SerialPort from 'serialport';
import { IReceivedData } from './IReceivedData';

export interface ISharedObject {
    ports: SerialPort.PortInfo[];
    headers: IReceivedData;
    data: IReceivedData[];
}
