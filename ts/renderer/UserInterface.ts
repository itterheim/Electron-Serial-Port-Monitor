import { IReceivedData } from '../shared/IReceivedData';
import { Globals } from './Globals';

export class UserInterface {
    public onConnectClick: (port: string, baudRate: number) => void;
    public onDisconnectClick: () => void;
    public onRefreshClick: () => void;

    private root: HTMLDivElement;

    private headers: HTMLDivElement;
    private data: HTMLDivElement;

    private portSelect: HTMLSelectElement;
    private baudRateSelect: HTMLSelectElement;

    private refreshButton: HTMLButtonElement;
    private connectButton: HTMLButtonElement;
    private disconnectButton: HTMLButtonElement;

    constructor () {
        this.root = document.querySelector('div.app');

        this.create();
    }

    public clearHeaders () {
        this.headers.innerHTML = '';
    }

    public setHeaders (data: IReceivedData) {
        this.headers.innerHTML = data.data.join(' - ');
    }

    public clearData () {
        this.data.innerHTML = '';
    }

    public setData (data: IReceivedData[]) {
        for (const item of data) {
            this.addData(item);
        }
    }

    public addData (data: IReceivedData) {
        this.data.insertAdjacentHTML('afterbegin', `${data.data.join(' - ')}<br/>`);
    }

    public updatePorts () {
        this.portSelect.innerHTML = Globals.ports.map((x) => `<option>${x.path}</option>`).join('\n');
    }

    private create () {
        this.root.insertAdjacentHTML('afterbegin', `
            <div>
                <button id="refresh">Refresh</button>
                <select id="port">
                    ${Globals.ports.map((x) => `<option>${x.path}</option>`)}
                </select>
                <select id="baudRate">
                    <option>110</option>
                    <option>300</option>
                    <option>600</option>
                    <option>1200</option>
                    <option>2400</option>
                    <option>4800</option>
                    <option selected>9600</option>
                    <option>14400</option>
                    <option>19200</option>
                    <option>38400</option>
                    <option>57600</option>
                    <option>115200</option>
                    <option>128000</option>
                    <option>256000</option>
                </select>
                <button id="connect">Connect</button>
                <button id="disconnect">Disconnect</button>
            </div>
            <br/>
            <div class="headers"></div>
            <br/>
            <div class="data"></div>
        `);

        this.refreshButton = document.getElementById('refresh') as HTMLButtonElement;
        this.portSelect = document.getElementById('port') as HTMLSelectElement;
        this.baudRateSelect = document.getElementById('baudRate') as HTMLSelectElement;
        this.connectButton = document.getElementById('connect') as HTMLButtonElement;
        this.disconnectButton = document.getElementById('disconnect') as HTMLButtonElement;
        this.headers = document.querySelector('div.headers');
        this.data = document.querySelector('div.data');

        this.refreshButton.onclick = () => {
            if (this.onRefreshClick) {
                this.onRefreshClick();
            }
        };

        this.connectButton.onclick = () => {
            const port = this.portSelect.value;
            const baudRate = parseInt(this.baudRateSelect.value, 10);

            if (this.onConnectClick) {
                this.onConnectClick(port, baudRate);
            }
        };

        this.disconnectButton.onclick = () => {
            if (this.onDisconnectClick) {
                this.onDisconnectClick();
            }
        };

        // window.onresize = () => {
        //   console.log(window.window.innerWidth, window.innerHeight)
        // }
    }
}
