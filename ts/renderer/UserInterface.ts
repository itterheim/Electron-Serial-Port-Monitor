import { IReceivedData } from '../shared/IReceivedData';
import { DataStore } from './DataStore';
import { ChartTab } from './tabs/ChartTab';
import { DataTab } from './tabs/DataTab';
import { ITab } from './tabs/ITab';
import { MonitorTab } from './tabs/MonitorTab';

type TabType = 'monitor' | 'chart' | 'data';

export class UserInterface {
    public onConnectClick: (port: string, baudRate: number) => void;
    public onDisconnectClick: () => void;
    public onRefreshClick: () => void;

    private root: HTMLDivElement;

    private content: HTMLDivElement;

    private portSelect: HTMLSelectElement;
    private baudRateSelect: HTMLSelectElement;

    private refreshButton: HTMLButtonElement;
    private connectButton: HTMLButtonElement;
    private disconnectButton: HTMLButtonElement;

    private monitorTab: HTMLDivElement;
    private dataTab: HTMLDivElement;
    private chartTab: HTMLDivElement;

    private tab: TabType;
    private tabContent: ITab;

    constructor () {
        this.root = document.querySelector('div.app');

        this.create();
        this.showTab();
    }

    public clearData () {
        this.tabContent.clearData();
    }

    public setHeaders (data: IReceivedData) {
        if (this.tabContent?.setHeaders) {
            this.tabContent.setHeaders(data);
        }
    }

    public setData (data: IReceivedData[]) {
        for (const item of data) {
            this.addData(item);
        }
    }

    public addData (data: IReceivedData) {
        if (this.tabContent?.addData) {
            this.tabContent.addData(data);
        }
    }

    public updatePorts () {
        this.portSelect.innerHTML = DataStore.ports.map((x) => `<option>${x}</option>`).join('\n');
    }

    private create () {
        const html = `
            <div class="connection">
                <button id="refresh">Refresh</button>
                <select id="port">
                    ${DataStore.ports.map((x) => `<option>${x}</option>`)}
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

            <div class="tabs">
                <div class="tab selected" id="tab-monitor">Monitor</div>
                <div class="tab" id="tab-chart">Chart</div>
                <div class="tab" id="tab-data">Data</div>
            </div>

            <div class="content">
            </div>
        `;

        this.root.insertAdjacentHTML('afterbegin', html);

        this.refreshButton = document.getElementById('refresh') as HTMLButtonElement;
        this.portSelect = document.getElementById('port') as HTMLSelectElement;
        this.baudRateSelect = document.getElementById('baudRate') as HTMLSelectElement;
        this.connectButton = document.getElementById('connect') as HTMLButtonElement;
        this.disconnectButton = document.getElementById('disconnect') as HTMLButtonElement;
        this.monitorTab = document.getElementById('tab-monitor') as HTMLDivElement;
        this.chartTab = document.getElementById('tab-chart') as HTMLDivElement;
        this.dataTab = document.getElementById('tab-data') as HTMLDivElement;
        this.content = document.querySelector('div.content');

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

        this.monitorTab.onclick = () => this.showTab('monitor');
        this.chartTab.onclick = () => this.showTab('chart');
        this.dataTab.onclick = () => this.showTab('data');
    }

    private showTab (tab?: TabType) {
        this.tab = tab ?? 'monitor';
        this.unselectTabs();

        if (this.tabContent) {
            this.tabContent.hide();
        }

        if (this.tab === 'monitor') {
            this.monitorTab.classList.add('selected');
            this.tabContent = new MonitorTab(this.content);
        }
        if (this.tab === 'chart') {
            this.chartTab.classList.add('selected');
            this.tabContent = new ChartTab(this.content);
        }
        if (this.tab === 'data') {
            this.dataTab.classList.add('selected');
            this.tabContent = new DataTab(this.content);
        }

        this.tabContent.show();
    }

    private unselectTabs () {
        this.monitorTab.classList.remove('selected');
        this.chartTab.classList.remove('selected');
        this.dataTab.classList.remove('selected');
    }
}
