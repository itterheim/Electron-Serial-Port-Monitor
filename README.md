# Serial Port Monitor

Serial port monitor written in TypeScript and Electron.

This is a work in progress.

## Data requirements
- messages separated by `\n`

### chart and table
- values separated by comma `,`
- first message contains data header
- first value is used for the `x` axis
- values are parsed as `float` or ignored

## Download (windows x64)

Release: https://github.com/itterheim/Electron-Serial-Port-Monitor/releases/latest

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
