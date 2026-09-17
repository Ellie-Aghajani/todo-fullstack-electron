import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import Store from "electron-store";

let mainWindow: BrowserWindow | null = null;
const isDev = !app.isPackaged;

interface WindowBounds {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

const store = new Store() as Store & {
  get: (key: string, defaultValue?: unknown) => unknown;
  set: (key: string, value: unknown) => void;
};

function getSavedBounds(): WindowBounds {
  const saved = store.get("windowBounds") as WindowBounds | undefined;
  if (
    saved &&
    typeof saved.width === "number" &&
    typeof saved.height === "number"
  ) {
    return saved;
  }
  return { width: 1000, height: 700 };
}

function createWindow() {
  const savedBounds = getSavedBounds();

  mainWindow = new BrowserWindow({
    ...savedBounds,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5174");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("resize", saveBounds);
  mainWindow.on("move", saveBounds);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function saveBounds() {
  if (mainWindow) {
    store.set("windowBounds", mainWindow.getBounds());
  }
}
function createMenu() {
  const isMac = process.platform === "darwin";

  const template: Electron.MenuItemConstructorOptions[] = [
    // On macOS, apps conventionally have a first menu named after the
    // app itself (containing About/Quit/etc.) — this is expected by
    // macOS users and looks wrong if missing.
    ...(isMac
      ? [
          {
            label: app.getName(),
            submenu: [
              { role: "about" as const },
              { type: "separator" as const },
              { role: "quit" as const },
            ],
          },
        ]
      : []),
    {
      label: "File",
      submenu: [isMac ? { role: "close" as const } : { role: "quit" as const }],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" as const },
        { role: "redo" as const },
        { type: "separator" as const },
        { role: "cut" as const },
        { role: "copy" as const },
        { role: "paste" as const },
        { role: "selectAll" as const },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" as const },
        { role: "toggleDevTools" as const },
        { type: "separator" as const },
        { role: "resetZoom" as const },
        { role: "zoomIn" as const },
        { role: "zoomOut" as const },
        { type: "separator" as const },
        { role: "togglefullscreen" as const },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createMenu();
  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
