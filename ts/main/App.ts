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
        const mainScreen = electron.screen.getPrimaryDisplay();
        const dimensions = mainScreen.size;

        const win = new electron.BrowserWindow({
            title: 'Serial Monitor',
            width: Math.max(800, Math.round(dimensions.width * 0.75 / 10) * 10), // 75% of width
            height: Math.max(600, Math.round(dimensions.height * 0.75 / 10) * 10), // 75% of height
            webPreferences: {
                nodeIntegration: true
            }
        });
        win.setMenuBarVisibility(false);
        win.loadFile(path.join(__dirname, '../../web/index.html'));

        // win.webContents.openDevTools();

        win.on('closed', () => this.serial.close());

        // receive events from the renderer process
        electron.ipcMain.on('serial-connect', async (channel, arg) => {
            if (this.serial.isOpen()) {
                await this.serial.close();
            }
            this.serial.open(JSON.parse(arg), channel);
        });

        electron.ipcMain.on('serial-disconnect', () => this.serial.close());

        electron.ipcMain.on('serial-refresh-ports', (channel) => this.serial.loadPorts(channel));
    }
}
