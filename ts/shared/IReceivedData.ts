import { IPortData } from './IPortData';

export interface IReceivedData extends IPortData {
    type: 'values' | 'headers';
    data: Array<string | number>;
}
