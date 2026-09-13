import { app, BrowserWindow } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null = null;

// isDev checks whether we're running from source (npm run electron:dev)
// or from a packaged, built app. app.isPackaged is Electron's built-in
// way to tell the difference.
const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      // The renderer (React) never gets direct Node.js access. This is
      // the core Electron security boundary — without it, any malicious
      // or buggy web content loaded in the window could read/write your
      // entire file system.
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    // In development, load the actual Vite dev server, same as opening
    // it in a browser — but inside this native window instead.
    mainWindow.loadURL("http://localhost:5174");
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built static files directly from disk.
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// app.whenReady() resolves once Electron has finished starting up
// internally — you can't create windows before this.
app.whenReady().then(createWindow);

// Standard convention: on Windows/Linux, quit when all windows close.
// On macOS, apps conventionally stay running (in the dock) until the
// user explicitly quits, even with no windows open.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// macOS convention: clicking the dock icon when no windows are open
// should reopen one, rather than doing nothing.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
