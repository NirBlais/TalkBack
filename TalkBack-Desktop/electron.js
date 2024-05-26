import { app , BrowserWindow, Tray ,Menu} from 'electron'
import path from 'path'
import { ipcMain } from 'electron';


let tray = null;
let win

const createWindow = () => {
     win = new BrowserWindow({
      width: 800,
      height: 600,
      icon: path.join(app.getAppPath(), './images/logo.png'), // Path to your icon image
    })
  
    win.loadURL('http://localhost:5177')

  }

  app.whenReady().then(() => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('ready', () => {
    // Create a tray icon
    tray = new Tray(path.join(app.getAppPath(), './images/logo-offline.png'));
  
    // Create a context menu for the tray icon
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Sign In', type: 'normal', click: () => {
        win.loadURL('http://localhost:5177/login')
      } },
      { label: 'Sign Out', type: 'normal', click: () => {
        win.loadURL('http://localhost:5177')
      } },
      { label: 'Open', type: 'normal', click: () => {!win.isVisible() && win.show()} },
      { type: 'separator' },
      { label: 'Exit', type: 'normal', role: 'quit' }
    ]);
  
    // Set the context menu
    tray.setContextMenu(contextMenu);
  
    // Optionally, set a tooltip for the tray icon
    tray.setToolTip('My Electron App');

    tray.on('click', () => {
      tray.popUpContextMenu();
    });
  });