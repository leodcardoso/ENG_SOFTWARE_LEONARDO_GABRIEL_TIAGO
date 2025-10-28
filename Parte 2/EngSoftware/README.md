## **Guia de Inicialização do Projeto**

Este guia detalha o procedimento padrão para configurar e executar o ambiente de desenvolvimento local, composto por um servidor **Node.js (API)** e um cliente **React/Expo (Web)**.

### **1. Requisitos de Ambiente (Prerequisites)**

Certifique-se de que os seguintes componentes estão instalados e configurados em seu sistema antes de prosseguir:

* **Runtime:** Node.js (LTS, preferencialmente `v18.x` ou superior).
* **Gestor de Pacotes:** NPM (instalado com Node.js).
* **Controle de Versão:** Git.
* **Banco de Dados:** Instância ativa do **PostgreSQL**.

### **2. Configuração e Execução do Backend (API)**

O Backend é o serviço responsável pela lógica de negócio e pela persistência de dados.

| Etapa | Comando Shell | Descrição |
| :--- | :--- | :--- |
| **Navegação** | `cd "Parte 2\EngSoftware\Backend"` | Acessa o diretório raiz do projeto Backend. |
| **Setup** | `npm install` (ou `npm i`) | Instala todas as dependências do projeto, conforme `package.json`. |
| **Execução** | `npm run dev` | Inicia o servidor em modo de desenvolvimento. O serviço deve escutar em `http://localhost:3000`. |

### **3. Configuração e Execução do Frontend (Cliente Web)**

O Frontend é a interface do usuário construída em React/Expo que consome a API do Backend.

| Etapa | Comando Shell | Descrição |
| :--- | :--- | :--- |
| **Navegação** | `cd "Parte 2\EngSoftware"` | Acessa o diretório raiz do projeto Frontend/Monorepo. |
| **Setup** | `npm install` (ou `npm i`) | Instala todas as dependências do cliente web. |
| **Execução** | `npx expo start --web` | Inicia o *bundler* e o servidor de desenvolvimento do Expo, acessível via navegador (ex: `http://localhost:8081`). |

---

**Resultado Esperado:** Após executar os comandos acima, o Backend estará ativo em `localhost:3000` e o Frontend estará em execução em sua porta dedicada, comunicando-se via requisições HTTP para a API.