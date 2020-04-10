import { ISharedObject } from '../shared/ISharedObject';
import { App } from './App';

// global - awailable in both main and renderer processes
declare global {
    namespace NodeJS {
        interface Global {
            sharedObject: ISharedObject;
        }
    }
}

global.sharedObject = {
    ports: [],
    headers: undefined,
    data: []
};

// start main process app
new App();
