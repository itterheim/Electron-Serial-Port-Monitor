import * as electron from 'electron';
import { IPortData } from '../shared/IPortData';
import { IReceivedData } from '../shared/IReceivedData';
import { UserInterface } from './UserInterface';

// Renderer process (chrome window)
class App {
    private ui: UserInterface;

    constructor () {
        this.ui = new UserInterface();
        this.ui.onConnectClick = (port, baudRate) => this.connect(port, baudRate);
        this.ui.onDisconnectClick = () => this.disconnect();
        this.ui.onRefreshClick = () => this.refreshList();

        // receive events from the main process
        electron.ipcRenderer.on('serial-data', (_, arg: string) => {
            const data: IReceivedData = JSON.parse(arg);

            console.log(data);

            if (data.type === 'values') {
                this.ui.addData(data);
            } else if (data.type === 'headers') {
                this.ui.setHeaders(data);
            }
        });

        electron.ipcRenderer.on('serial-closed', () => {
            this.ui.clearHeaders();
            this.ui.clearData();
        });

        electron.ipcRenderer.on('serial-ports', () => {
            this.ui.updatePorts();
        });

        electron.ipcRenderer.on('serial-error', (_, arg) => {
            console.log('serial port error', arg);
        });
    }

    private connect (port: string, baudRate: number) {
        const data: IPortData = {
            port,
            baudRate
        };

        this.ui.clearHeaders();
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

// Start
new App();
