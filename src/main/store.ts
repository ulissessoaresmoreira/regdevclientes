import {app, ipcMain} from 'electron';
import PouchDB from 'pouchdb';
// BIBLIOTECA NODE:PATH É PARA ESCOLHER O CAMINHO
import path from 'node:path';
// BIBLIOTECA NODE:FS É PARA MANIPULAR ARQUIVOS FS - FILE SYSTEM
import fs from 'node:fs';
import {Customer, NewCustomer} from '../shared/types/ipc';
// ESTA BIBILIOTECA É PARA GERAR UM ID ALEATÓRIO, SERÁ GERADO PARA INSERIR NO BANCO DE DADOS PARA CADA ITEM QUE SALVAR NO BANCO
import { randomUUID } from 'node:crypto';

//DETERMINAR O CAMINHO BASE PARA O BANDO DE DADOS DE ACORDO COM O SISTEMA OPERACIONAL
let dbPath;
if(process.platform === "darwin"){
  // CAMINHO PARA O MACOS - OBS ONDE ESTÁ DEV CLIENTES É BOM SEMPRE USAR O MESMO NOME DO PROJETO
  dbPath = path.join(app.getPath("appData"), "devclientes", "my_db")
}else{
  //CAMINHO PARA O WINDOWS
  dbPath = path.join(app.getPath("userData"), "my_db")
}

//VERIFICAR E CRIAR O DIRETÓRIO SE NÃO EXISTIR
const dbDir = path.dirname(dbPath);
if(!fs.existsSync(dbDir)){
  fs.mkdirSync(dbDir, {recursive: true})
}

// INICIALIZAR O DB
const db = new PouchDB<Customer>(dbPath)

//FUNÇÃO PARA ADICIONAR NO BANCO DE DADOS
async function addCustomer(doc: NewCustomer): Promise<PouchDB.Core.Response | void>{
  // console.log(doc); ISTO E A LINHA ABAIXO ESTAVAM APENAS PARA VERIFICAR SE A INFORMAÇÃO CHEGAVA AQUI, POIS A INFORMAÇÃO QUE CHEGA É A QUE VAI PARA O BANCO DE DADOS
  // return doc;
  const id = randomUUID();
  const data: Customer = {
    ...doc, // OS 3 PONTOS SIGNIFICAM QUE VAI RECEBER TUDO QUE VIER DO DOC
    _id: id
  }
  return db.put(data)
    .then(response => response)
    .catch(error => console.log("ERRO AO REGISTAR :", error))
}

// CRIAÇÃO DO HANDLE PARA CADASTRAR UM CLIENTE
ipcMain.handle("add-customer", async (event, doc: Customer) => {
  const result = await addCustomer(doc);  
  return result;
})


//FUNÇÃO PARA CRIAR TODOS OS CLIENTES
async function fetchAllCustomers(): Promise<Customer[]>{
  try {
    const result = await db.allDocs({include_docs: true})
    return result.rows.map(row => row.doc as Customer)
  } catch (error) {
    console.log("ERRO AO BUSCAR INFORMAÇÕES: ", error)
    return[]
  }
}
ipcMain.handle("fetch-all-customers", async () => {
  return await fetchAllCustomers();
})

// FUNÇÃO PARA BUSCAR UM CLIENTE ESPECÍFICO PELO ID (depois fazer para buscar pelo nome)
async function fecthCustomerById(docId: string){
  return db.get(docId)
    .then(doc => doc)
    .catch(error => {
      console.log("ERRO AO BUSCAR INFORMAÇÕES DO CLIENTE: ", error)
      return[]
    })
}
ipcMain.handle("fetch-customer-id", async (event, docId) => {
  const result = await fecthCustomerById(docId);
  return result;
})


//DELETAR UM CLIENTE
async function deleteCustomer(docId: string): Promise<PouchDB.Core.Response | null>{
  try {
    const doc = await db.get(docId);
    const result = await db.remove(doc._id, doc._rev);
    return result;
  } catch (error) {
    console.log("ERRO AO TENTAR DELETAR CLIENTE: ", error)
    return null
  }  
}
ipcMain.handle("delete_customer", async(event, docId): Promise<PouchDB.Core.Response | null> =>{
  return await deleteCustomer(docId)
})