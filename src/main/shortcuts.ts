import { BrowserWindow, app, globalShortcut } from "electron";


export function createShortcuts(window: BrowserWindow){
  app.on("browser-window-focus", () => {
    globalShortcut.register("ComandOrControl+N", () => {
      window.webContents.send("new-customer")
    })
  })

  app.on("browser-window-blur", () => {
    globalShortcut.unregisterAll();
  })
}