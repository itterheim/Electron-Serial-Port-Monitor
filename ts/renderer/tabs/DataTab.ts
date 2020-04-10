import { IReceivedData } from '../../shared/IReceivedData';
import { DataStore } from '../DataStore';
import { ITab } from './ITab';

export class DataTab implements ITab {
    private dataTable: HTMLTableElement;
    // private intervalsTable: HTMLTableElement;

    constructor (private content: HTMLDivElement) { }

    public show () {
        this.content.classList.add('content-tab-data');
        this.clearData();

        DataStore.numericData.values.forEach((v) => this.addDataTableRow(v));
        DataStore.numericData.onNewData = (v) => this.addDataTableRow(v);
    }

    public hide () {
        this.content.innerHTML = '';
        this.content.classList.remove('content-tab-data');
    }

    public setHeaders (data: IReceivedData) {
        const row = `
            <tr>
                ${data.data.map((x) => `<th>${x}</th>`).join('')}
            </tr>
        `;
        this.dataTable.querySelector('thead').innerHTML = row;
    }

    public clearData () {
        const html = `
            <div class="data-table"></div>
            <!--<div class="intervals-table"></div>-->
        `;
        this.content.innerHTML = html;

        this.dataTable = document.querySelector('div.data-table');
        // this.intervalsTable = document.querySelector('div.intervals-table');

        this.showDataTable();
        this.showIntervalTable();
    }

    private showDataTable () {
        const html = `
            <table>
                <thead></thead>
                <tbody></tbody>
            </table>
        `;
        this.dataTable.innerHTML = html;

        if (DataStore.headers) {
            this.setHeaders(DataStore.headers);
        }

    }

    private addDataTableRow (values: number[]) {
        const row = `
            <tr>
                ${values.map((x) => `<td>${isNaN(x) ? '?' : x}</td>`).join('')}
            </tr>
        `;
        this.dataTable.querySelector('tbody').insertAdjacentHTML('beforeend', row);
    }

    private showIntervalTable () {
        // const html = `
        //     <thead>
        //         <tr>
        //             <th></th>
        //             <th></th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //         <tr>
        //             <td></td>
        //             <td></td>
        //         </tr>
        //     </tbody>
        // `;

        // this.intervalsTable.innerHTML = html;
    }
}
