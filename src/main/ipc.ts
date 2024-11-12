import { app, ipcMain, IpcMain } from "electron";

ipcMain.handle("fetch-users", ()=> {
  console.log("Buscando usuários...")

  return[
    {id: 1, nome: "Ulisses"},
    {id: 2, nome: "Aquiles"},
  ]
})

ipcMain.handle("get-version", () => {
  return app.getVersion();
})