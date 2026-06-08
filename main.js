const { app, BrowserWindow, ipcMain, nativeImage } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "Promptly",
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      webviewTag: true, // Enables <webview> which bypasses iframe security
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('desktop.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('web-contents-created', (event, contents) => {
  // Allow webviews to open popups (required for Google/Apple OAuth login windows)
  contents.setWindowOpenHandler(({ url }) => {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      }
    };
  });
});

// IPC: Save image to temp file (called when user picks images from the tray picker)
ipcMain.handle('save-temp-image', (event, { dataUrl, name }) => {
  const data = dataUrl.replace(/^data:[^;]+;base64,/, '');
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const tmpPath = path.join(os.tmpdir(), `ai-grid-${Date.now()}-${safeName}`);
  fs.writeFileSync(tmpPath, Buffer.from(data, 'base64'));
  return tmpPath;
});

// IPC: Initiate a native OS file drag from the image tray thumbnail.
// MUST use ipcMain.on (not handle) — startDrag must be called synchronously
// during the drag event. ipcMain.handle is async and misses the drag window.
ipcMain.on('start-drag', (event, { filePath, dataUrl }) => {
  const icon = nativeImage.createFromDataURL(dataUrl).resize({ width: 64, height: 64 });
  event.sender.startDrag({ file: filePath, icon });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});