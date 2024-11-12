import { contextBridge, ipcRenderer } from 'electron'
import { ElectronAPI, electronAPI } from '@electron-toolkit/preload'
import { Customer, NewCustomer } from '../shared/types/ipc'

declare global {
  export interface Window{
    electron: ElectronAPI
    api: typeof api
  }
}

// Custom APIs for renderer
const api = {
  onNewCustomer: (callback: () => void) => {
    ipcRenderer.on("new-customer", callback)
    
    return() => {
      ipcRenderer.off("new-customer", callback)
    }
  },
  // INVOKE PODE ENVIAR E RECEBER DO MAIN - coloquei o nome como nomequeeuquiser para indicar que esse nome eu crio e depois uso o mesmo nome no renderer onde vai chamar essa função, (quando der windows.api.aqui vai aparecer o nome da função ) mas ela é criada aqui neste arquivo
  fetchUsersNomeQueEuQuiser: () => {
    return ipcRenderer.invoke("fetch-users")
  },  
  addCustomer:(doc: NewCustomer): Promise<PouchDB.Core.Response | void> => ipcRenderer.invoke("add-customer", doc),

  fetchAllCustomers: (): Promise<Customer[]> => ipcRenderer.invoke("fetch-all-customers"),

  fetchCustomerById: (docId: string): Promise<Customer> => ipcRenderer.invoke("fetch-customer-id", docId),

  deleteCustomer: (docId: string) => ipcRenderer.invoke("delete_customer", docId),

  getVersionApp: () => ipcRenderer.invoke("get-version")


}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
