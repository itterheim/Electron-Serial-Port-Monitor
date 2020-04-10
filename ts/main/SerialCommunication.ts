import * as electron from 'electron';

import readline from '@serialport/parser-readline';
import SerialPort from 'serialport';
import { IPortData } from '../shared/IPortData';
import { IReceivedData } from '../shared/IReceivedData';

export class SerialCommunication {
    private port: SerialPort;

    constructor () {
        this.loadPorts();
    }

    public async loadPorts (outChannel?: electron.IpcMainEvent) {
        const ports = await SerialPort.list();

        if (outChannel) {
            outChannel.reply('serial-ports', JSON.stringify(ports.map((x) => x.path)));
        }
    }

    public open (data: IPortData, outChannel: electron.IpcMainEvent) {
        this.port = new SerialPort(data.port, {
            baudRate: data.baudRate
        }, (err) => {
            if (err) {
                console.log('SerialPort.open error', err);
                outChannel.reply('serial-error', err.message);
            }
        });

        const parser = new readline();
        this.port.pipe(parser);

        this.port.on('open', () => {
            try {
                outChannel.reply('serial-opened', 'opened');
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial port opened"');
            }
        });

        this.port.on('close', () => {
            try {
                outChannel.reply('serial-closed', 'closed');
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial port closed"');
            }
        });

        let first = true;
        parser.on('data', (line: string) => {
            const outData: IReceivedData = {
                timestamp: new Date().toISOString(),
                port: data.port,
                baudRate: data.baudRate,
                type: 'values',
                data: line.split(','),
                raw: line
            };

            if (first) {
                first = false;
                outData.type = 'headers';
                outData.data = line.split(',');
            }

            try {
                outChannel.reply('serial-data', JSON.stringify(outData));
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial data"');
            }
        });
    }

    public async close (): Promise<void> {
        if (this.port && this.port.isOpen) {
            return new Promise((resolve, reject) => {
                this.port.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }

    public isOpen (): boolean {
        return this.port && this.port.isOpen;
    }
}
