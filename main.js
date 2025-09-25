const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let isMinimized = false;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: 300,
    height: 600,
    x: 50, // Position on left side
    y: 100,
    frame: false, // Remove window frame for custom styling
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    titleBarStyle: 'hidden'
  });

  mainWindow.loadFile('index.html');
  
  // Keep window always on top
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  
  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle minimize to side
ipcMain.on('minimize-to-side', () => {
  if (!isMinimized) {
    mainWindow.setBounds({
      x: -250, // Hide most of window
      y: mainWindow.getBounds().y,
      width: 300,
      height: mainWindow.getBounds().height
    });
    isMinimized = true;
  } else {
    mainWindow.setBounds({
      x: 50, // Show window normally
      y: mainWindow.getBounds().y,
      width: 300,
      height: mainWindow.getBounds().height
    });
    isMinimized = false;
  }
});

// Handle transparency changes
ipcMain.on('set-transparency', (event, opacity) => {
  mainWindow.setOpacity(opacity);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});