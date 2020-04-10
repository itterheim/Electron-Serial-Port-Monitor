import { IReceivedData } from '../../shared/IReceivedData';
import { DataStore } from '../DataStore';
import { ITab } from './ITab';

export class ChartTab implements ITab {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private readonly colors = ['#f44', '#0a0', '#48f', '#ee0', '#0bb', '#c0c'];

    constructor (private content: HTMLDivElement) { }

    public show () {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.content.clientWidth;
        this.canvas.height = this.content.clientHeight;
        this.ctx = this.canvas.getContext('2d');

        this.content.classList.add('content-tab-chart');
        this.content.appendChild(this.canvas);

        this.render();
        DataStore.numericData.onNewData = () => this.render();

        window.onresize = () => {
            console.log(window.innerWidth, window.innerWidth);
            this.canvas.width = this.content.clientWidth;
            this.canvas.height = this.content.clientHeight;
            this.render();
        };
    }

    public hide () {
        this.content.innerHTML = '';
        this.content.classList.remove('content-tab-chart');
        window.onresize = undefined;
    }

    public clearData () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private render () {
        window.requestAnimationFrame(() => {
            this.clearData();
            this.renderAxis();
            this.renderData();
        });
    }

    private renderAxis () {
        const padding = 26;
        const top = padding + 5;
        let left = padding + 5;

        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = '14px FiraCode';

        DataStore.headers?.data.forEach((x, i) => {
            if (i === 0) { return; }

            this.ctx.beginPath();
            this.ctx.fillStyle = this.colors[i];
            this.ctx.arc(left, top, 5, 0, 2 * Math.PI);
            this.ctx.fill();

            this.ctx.fillStyle = '#000';
            const size = this.ctx.measureText(x);
            this.ctx.fillText(x, left + 10, top + 1);

            left += size.width + 26 + 5;
        });

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#000';
        this.ctx.beginPath();
        this.ctx.moveTo(padding - 0.5, 2 * padding - 0.5);
        this.ctx.lineTo(padding - 0.5, this.canvas.height - padding + 0.5);
        this.ctx.lineTo(this.canvas.width - padding + 0.5, this.canvas.height - padding + 0.5);
        this.ctx.stroke();
    }

    private renderData () {
        const padding = 26;

        const data = DataStore.numericData.values;
        const step = Math.min(20, (this.canvas.width - 2 * padding) / data.length);

        const height = this.canvas.height - 3 * padding;
        const max = DataStore.numericData.max.slice(1).reduce((s, x) => isNaN(x) ? s : Math.max(s, x), 50);
        const min = DataStore.numericData.min.slice(1).reduce((s, x) => isNaN(x) ? s : Math.min(s, x), 0);
        const range = max - min;

        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';

        let previous: number[] = [];
        for (let i = 0; i < data.length; i++) {
            const values = data[i];

            if (i > 0) {
                values.forEach((v, j) => {
                    if (j === 0) { return; }

                    const h1 = (height / range) * (previous[j] - min);
                    const x1 = padding + (i - 1) * step;
                    const y1 = this.canvas.height - padding - h1;

                    const h2 = (height / range) * (v - min);
                    const x2 = padding + i * step;
                    const y2 = this.canvas.height - padding - h2;

                    this.ctx.strokeStyle = this.colors[j];
                    this.ctx.beginPath();
                    this.ctx.moveTo(x1, y1);
                    this.ctx.lineTo(x2, y2);
                    this.ctx.stroke();
                });
            }

            previous = values;
        }
    }
}
