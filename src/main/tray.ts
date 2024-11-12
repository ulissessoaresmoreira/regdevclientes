import {Menu, Tray, nativeImage, BrowserWindow} from 'electron';
import path from 'node:path';


export function createTray(window: BrowserWindow){
  const appIcon = path.join(__dirname,"resources", "menuTemplate.png" )
  let icon = nativeImage.createFromPath(appIcon)

  const tray = new Tray(icon)

  const menu = Menu.buildFromTemplate([
    {label: "Dev Clientes", enabled: false,},
    {type: 'separator'},

    {
      label: "Registar cliente",
      click: () => {        
        // console.log("Registar cliente")
        // ABAIXO IRÁ CRIAR PROCESSO QUE VAI ENVIAR MENSAGEM DO PROCESSO MAIN PARA O RENDERER (FRONTEND) PELO TRAY
        window.webContents.send("new-customer")
        if(window.isMinimized()) window.restore();
        window.focus();
      }
    },

    {
      label: "Abrir",
      click: () => {
        window.show();
      }
    },

    {type: "separator"},

    {
      label: "Sair",
      role: 'quit'
    }
  ])

  tray.setToolTip("Dev Clientes")

  tray.setContextMenu(menu);

}