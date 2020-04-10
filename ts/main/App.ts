import * as electron from 'electron';
import * as path from 'path';

import { SerialCommunication } from './SerialCommunication';

// Main process
export class App {
    private serial: SerialCommunication;
    constructor () {
        // serial communication
        this.serial = new SerialCommunication();
        this.serial.loadPorts();

        // initialize electron;
        electron.app.allowRendererProcessReuse = true;
        electron.app.whenReady().then(() => this.createWindow());

        electron.app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                electron.app.quit();
            }
        });

        electron.app.on('activate', () => {
            if (electron.BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });
    }

    private createWindow () {
        const win = new electron.BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        });
        win.setMenuBarVisibility(false);
        win.loadFile(path.join(__dirname, '../../web/index.html'));

        win.webContents.openDevTools();

        win.on('closed', () => this.serial.close());

        // receive events from the renderer process
        electron.ipcMain.on('serial-connect', async (event, arg) => {
            if (this.serial.isOpen()) {
                await this.serial.close();
            }
            this.serial.open(JSON.parse(arg), event);
        });

        electron.ipcMain.on('serial-disconnect', () => this.serial.close());

        electron.ipcMain.on('serial-refresh-ports', (event) => this.serial.loadPorts(event));
    }
}
