import { IReceivedData } from '../../shared/IReceivedData';

export interface ITab {
    show (): void;
    hide (): void;
    clearData (): void;
    addData? (data: IReceivedData): void;
    setHeaders? (data: IReceivedData): void;
}
