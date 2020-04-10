# /main

### main.ts
This file has only one purpose - to create an instance of the `./main/App` class

### App.ts
`App` class is the core of the Electron application

- creates the application window
- creates an instance of `SerialCommunication` class
- communicates with the renderer process using `ipcMain` (https://www.electronjs.org/docs/api/ipc-main)

### SerialCommunication.ts
This is a wrapper class to handle the serial communication

- uses the `SerialPort` library (https://serialport.io/)
- list available ports
- connect to a serial port with a given baud rate
- disconnect form a port
- notify renderer process about connection through ipcMain events

# /renderer

### index.ts
This file has only one purpose - to create an instance of the `/renderer/App` class

### App.ts
`App` class creates the frontend application

- communicates with the main process using `ipcRenderer` (https://www.electronjs.org/docs/api/ipc-renderer)
- forwards data from the main process to the `DataStore` and `UserInterface` classes
- handles commands from `UserInterface` (connect, disconnect) and sends them to the main process

### DataStore.ts
Static class for data storage

### UserInterface.ts
Rendering of UI and data visualization

# /shared

Interfaces common for the main and renderer processes
