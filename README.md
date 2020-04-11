# Serial Port Monitor

Serial port monitor written in TypeScript and Electron.

`This is a work in progress.`

README contents:
- [Data requirements](#data-requirements)
- [Download](#download-windows-x64)
- [Build](#build)
- [Screenshots](#screenshots)
- [How it works](#how-it-works)

## Data requirements
data example:
```
> time,humidity,temperature
> 1,20.8,28
> 1001,21.41,28
> 2001,21.93,28
> 3002,22.1,28
> 4003,22.24,28
```

- messages separated by `\n`

### chart and table
- values separated by comma `,`
- first message contains data header
- first value is used for the `x` axis
- values are parsed as `float` or ignored

## Download (windows x64)

Release: https://github.com/itterheim/Electron-Serial-Port-Monitor/releases/latest

(zip: ~70 MB, unpacked: ~180 MB)

## Build

1. https://nodejs.org/en/
2. `npm install`
3. Start:
- **option 1:** start app: `npm run start`
- **option 2:** create executable: `npm run dist` (creates new folder `Serial Port Monitor-...`)

## Screenshots

![Monitor](/screenshots/monitor.png)

![Chart](/screenshots/chart.png)

![Table](/screenshots/table.png)

## How it works
### Node.js
- JavaScript runtime
- https://nodejs.org/en/
- command: `npm` - package manager
- file: `package.js` - description of the app and its dependencies

### TypeScript
- JavaScript on steroids (transpiles into JavaScript - makes life much more easier)
- [TypeScript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- file: `tsconfig.json` - configuration of the TypeScript compiler 
- file: `tslint.json` - additional code analysis and automatic formatting
- command: `tsc` - transpiles code into JavaScript (folder `/dist`)

### Electron
- creates cross-platform desktop apps with JavaScript, HTML, and CSS
- https://www.electronjs.org/
- command: `electron .` - finds the main JavaScript file in `package.json` and starts the application
- command: `npm run start` - creates JavaScript files and immediately starts the application
- command: `npm run dist` - builds and creates executable application into the folder `/Serial Port Monitor-...`
 
#### Main process
`/ts/main/index.js`
- creates an application window;
- links `html` file into window (file: `/web/index.html`)
- manages communication with serial port

#### Renderer process
`/ts/renderer/index.js`
- linked through the `index.html` file.
- creates user interface

### Code
https://github.com/itterheim/Electron-Serial-Port-Monitor/tree/master/ts
