import * as electron from 'electron';
import { IPortData } from '../shared/IPortData';
import { IReceivedData } from '../shared/IReceivedData';
import { DataStore } from './DataStore';
import { NumericData } from './NumericData';
import { UserInterface } from './UserInterface';

// Renderer process (webkit window)
export class App {
    private ui: UserInterface;

    constructor () {
        this.ui = new UserInterface();
        this.ui.onConnectClick = (port, baudRate) => this.connect(port, baudRate);
        this.ui.onDisconnectClick = () => this.disconnect();
        this.ui.onRefreshClick = () => this.refreshList();

        // receive events from the main process
        electron.ipcRenderer.on('serial-data', (_, arg: string) => {
            const data: IReceivedData = JSON.parse(arg);
            if (data.type === 'headers') {
                DataStore.headers = data;
                this.ui.setHeaders(data);
            }
            DataStore.data.push(data);
            DataStore.numericData.addData(data);

            this.ui.addData(data);
        });

        electron.ipcRenderer.on('serial-opened', () => {
            DataStore.numericData.reset();
            DataStore.data = [];
        });

        electron.ipcRenderer.on('serial-closed', () => {
            DataStore.backup();
        });

        electron.ipcRenderer.on('serial-ports', (_, arg) => {
            DataStore.ports = JSON.parse(arg);
            this.ui.updatePorts();
        });

        electron.ipcRenderer.on('serial-error', (_, arg) => {
            console.log('serial port error', arg);
        });

        // initiate ports
        this.refreshList();
    }

    private connect (port: string, baudRate: number) {
        const data: IPortData = {
            port,
            baudRate
        };

        this.ui.clearData();

        electron.ipcRenderer.send('serial-connect', JSON.stringify(data));
    }

    private disconnect () {
        electron.ipcRenderer.send('serial-disconnect', '');
    }

    private refreshList () {
        electron.ipcRenderer.send('serial-refresh-ports', '');
    }
}
