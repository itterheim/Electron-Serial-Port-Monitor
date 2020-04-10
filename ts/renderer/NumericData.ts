import { IReceivedData } from '../shared/IReceivedData';

const re = /^(-)?[0-9]+(\.[0-9]+)?$/;

export class NumericData {
    public values: number[][] = [];

    public min: number[] = [];
    public max: number[] = [];
    public range: number[] = [];

    public onNewData: (value: number[]) => void;

    constructor (data: IReceivedData[] = []) {
        for (const item of data) {
            this.addData(item);
        }
    }

    public addData (data: IReceivedData) {
        let hasNumber = false;
        const parsed: number[] = [];

        for (let value of data.data) {
            value = value.trim();

            if (re.test(value)) {
                hasNumber = hasNumber || true;
                parsed.push(parseFloat(value));
            } else {
                parsed.push(NaN);
            }
        }

        if (hasNumber && !isNaN(parsed[0])) {
            for (let i = 0; i < parsed.length; i++) {
                const value = parsed[i];
                if (!isNaN(value)) {
                    this.max[i] = Math.max(this.max[i] ?? 0, value);
                    this.min[i] = Math.min(this.min[i] ?? Infinity, value);
                }
            }

            this.range = this.max.map((x, i) => this.isNanOrUndefined(x) || this.isNanOrUndefined(this.min[i]) ? this.range[i] : x - this.min[i]);
            this.values.push(parsed);

            if (this.onNewData) { this.onNewData(parsed); }
        }
    }

    public reset () {
        this.values = [];
        this.min = [];
        this.max = [];
        this.range = [];
    }

    private isNanOrUndefined (v: number): boolean {
        return isNaN(v) || v === undefined;
    }
}
