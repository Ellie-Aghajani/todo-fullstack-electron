import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronApp", {
  platform: process.platform,
  showNotification: (title: string, body: string) => {
    ipcRenderer.send("show-notification", { title, body });
  },
});