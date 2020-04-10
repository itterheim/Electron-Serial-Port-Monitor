import { IReceivedData } from '../../shared/IReceivedData';
import { DataStore } from '../DataStore';
import { ITab } from './ITab';

export class MonitorTab implements ITab {
    private readonly limit = 200;

    private up: HTMLDivElement;

    constructor (private content: HTMLDivElement) { }

    public show () {
        this.clearData();
        this.content.classList.add('content-tab-monitor');

        // init
        let html = '';
        const selectedData = DataStore.data.slice(-this.limit);
        for (let i = selectedData.length - 1; i >= 0; i--) {
            const data = selectedData[i];
            html += `
                <div class="monitor-row">
                    <span class="timestamp">${data.timestamp}&nbsp;&gt;&nbsp;</span>${data.raw}
                </div>
            `;
        }
        this.content.insertAdjacentHTML('afterbegin', html);

        this.content.onscroll = () => {
            if (this.content.scrollTop > 0) {
                this.up.style.visibility = 'visible';
            } else {
                this.up.style.visibility = 'hidden';
            }
        };
    }

    public hide () {
        this.content.innerHTML = '';
        this.content.classList.remove('content-tab-monitor');
    }

    public addData (data: IReceivedData) {
        this.content.insertAdjacentHTML('afterbegin', `
            <div class="monitor-row">
                <span class="timestamp">${data.timestamp}&nbsp;&gt;&nbsp;</span>${data.raw}
            </div>
        `);

        const all = this.content.querySelectorAll('div.monitor-row');
        if (all.length > this.limit) {
            this.content.removeChild(all[all.length - 1]);
        }

        if (this.content.scrollTop < 40) {
            this.content.scrollTop = 0;
            this.up.style.visibility = 'hidden';
        }
    }

    public clearData () {
        this.content.innerHTML = '<div class="up">UP</div>';
        this.up = this.content.querySelector('div.up');

        this.up.onclick = () => {
            this.content.scrollTop = 0;
            this.up.style.visibility = 'hidden';
        };
    }
}
