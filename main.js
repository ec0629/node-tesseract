const { app, BrowserWindow } = require('electron');

app.allowRendererProcessReuse = true;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });

  mainWindow.loadFile('renderer/index.html');

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
