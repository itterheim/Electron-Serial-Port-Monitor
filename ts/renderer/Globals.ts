import * as electron from 'electron';
import { ISharedObject } from '../shared/ISharedObject';

export class Globals {
    private static sharedObject: ISharedObject = electron.remote.getGlobal('sharedObject');

    static get ports () {
        return Globals.sharedObject.ports;
    }
    static get headers () {
        return Globals.sharedObject.headers;
    }
    static get data () {
        return Globals.sharedObject.data;
    }
}
