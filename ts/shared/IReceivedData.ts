import { IPortData } from './IPortData';

export interface IReceivedData extends IPortData {
    timestamp: string;
    type: 'values' | 'headers';
    data: string[];
    raw: string;
}
