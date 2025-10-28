## Objetivo

Criar um ambiente digital que torne o desenvolvimento pessoal mais atraente e sustentável. Ao unir a tecnologia com a interação social positiva, o software visa ser um catalisador para a disciplina e o foco, ajudando os usuários a alcançarem seus objetivos de forma consistente e motivadora.

---

## Ambiente de Desenvolvimento e Padrões

Para garantir a consistência e a funcionalidade do projeto, todos os desenvolvedores devem aderir aos seguintes requisitos de ambiente e padrões de codificação.

### 1. Requisitos Mínimos (Software)

Para compilar e executar este projeto, os seguintes componentes são necessários:

* **Node.js:** É necessário ter o [Node.js](https://nodejs.org/) instalado, preferencialmente a versão LTS (Suporte de Longo Prazo) mais recente (ex: `v18.x` ou superior).
* **NPM (Node Package Manager):** Instalado automaticamente com o Node.js. É usado para gerenciar todas as dependências do projeto (Frontend e Backend).
* **Banco de Dados (PostgreSQL):** O backend requer uma instância ativa do PostgreSQL para persistir os dados.
* **Git:** Utilizado para controle de versão.

### 2. Comunicação Web (Uso do `localhost`)

O ambiente de desenvolvimento local (`localhost`) é dividido em dois serviços principais que rodam simultaneamente:

1.  **Backend (API):** O servidor Node.js (Express) é executado localmente, escutando em uma porta específica (ex: `http://localhost:3000`). Ele é responsável por toda a lógica de negócio e comunicação com o banco de dados.
2.  **Frontend (Cliente Web):** A aplicação React (Expo Web) é executada em seu próprio servidor de desenvolvimento (ex: `http://localhost:8081` ou outra porta definida pelo Expo).

A **comunicação web** ocorre quando o Frontend (rodando no `localhost:8081`) faz requisições HTTP (GET, POST, PUT, DELETE) para o Backend (no `localhost:3000`) para buscar ou enviar dados.

---

### 1. Executando o Servidor Protótipo (API)
(Requer PostgreSQL rodando localmente)

# 1. Navegue até a pasta do backend
```
cd "Parte 2\EngSoftware\Backend"
```

# 2. Instale as dependências
```
npm i
```

# 3. Execute o servidor (em modo de desenvolvimento)
```
npm run dev
```

### 2. Executando na Web (Frontend)

# 1. Navegue até a pasta raiz do frontend
```
cd "Parte 2\EngSoftware"
```

# 2. Instale as dependências
```
npm i
```

# 3. Inicie o cliente web
```
npx expo start --web
```

---

## Arquitetura e Documentação

Esta seção centraliza todas as decisões de design, arquitetura e qualidade do projeto.

### 1. Gerência de Qualidade
As definições de papéis, responsabilidades, padrões de código (linting, commits), ferramentas e processos de QA (Code Review, Testes) estão documentadas em nosso Plano de Gestão da Qualidade.

*  **[Plano de Gestão da Qualidade (Completo)](./docs/qualidade/Plano_de_Gestao_da_Qualidade.md)**

### 2. Decisões Arquiteturais e Justificativas
As escolhas de tecnologia (Frontend, Backend, Banco de Dados) e a lógica por trás delas estão detalhadas no documento de Decisões de Arquitetura.

*  **[Decisões de Arquitetura (Completo)](./docs/arquitetura/Decisoes_de_Arquitetura.md)**

### 3. Diagrama de Arquitetura
O diagrama abaixo ilustra a arquitetura de alto nível do sistema, mostrando como os componentes (Cliente, Servidor, Banco de Dados) se comunicam:

![Diagrama de Arquitetura](./docs/arquitetura/Diagrama_de_Arquitetura.svg)

### 4. Decisões sobre Padrões de Projeto
A análise e justificativa dos Padrões de Projeto (Design Patterns) escolhidos para resolver problemas específicos de negócio (como notificações, cálculo de pontos e ações) estão documentadas abaixo:

*  **[Decisões e Justificativas dos Padrões de Projeto](./docs/padroes/Decisoes_de_Padroes.md)**

### 5. Diagramas dos Padrões de Projeto
Os diagramas UML de cada padrão, mapeados para as classes e módulos reais do nosso código-fonte, podem ser encontrados nos links abaixo:

*  **[Diagrama: Observer (Eventos/Notificações)](./docs/padroes/Observer.svg)**
*  **[Diagrama: Strategy (Cálculo de Pontuação)](./docs/padroes/Strategy.svg)**
*  **[Diagrama: Command (Ações/Desfazer)](./docs/padroes/Command.svg)**











--------------------------------------------------------------------------------------------------------


# Bem-vindo ao seu aplicativo Expo

Este é um projeto [Expo](https://expo.dev) criado com [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Começando - Resumido

1. Instale as dependências

   ```bash
   npm install
   ```

2. Inicie o aplicativo

   ```bash
   npx expo start
   ```

Na saída, você encontrará opções para abrir o aplicativo em:

- [build de desenvolvimento](https://docs.expo.dev/develop/development-builds/introduction/)
- [emulador Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [simulador iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), um ambiente limitado para experimentar o desenvolvimento de aplicativos com Expo

Você pode começar a desenvolver editando os arquivos dentro do diretório **app**. Este projeto usa [roteamento baseado em arquivos](https://docs.expo.dev/router/introduction).

## Obter um projeto novo

Quando estiver pronto, execute:

```bash
npm run reset-project
```

Este comando moverá o código inicial para o diretório **app-example** e criará um diretório **app** em branco onde você poderá começar a desenvolver.

## Configuração Adicional para Desenvolvimento Web

### Instalação de Dependências Essenciais

1. Instale os ícones e componentes de progresso:
   ```bash
   npm install react-native-vector-icons
   npm install react-native-progress
   ```

2. Configure a navegação:
   ```bash
   npm install @react-navigation/native
   npm install @react-navigation/native-stack
   ```

3. Instale as dependências nativas necessárias:
   ```bash
   npx expo install react-native-screens react-native-safe-area-context
   ```

### Solução de Problemas Comuns

- Se os ícones não aparecerem, tente:
  ```bash
  npx expo install @expo/vector-icons
  ```

- Para problemas com componentes de progresso:
  ```bash
  npx expo install react-native-svg
  ```

- Para limpar o cache e reinstalar:
  ```bash
  npx expo start -c
  ```

-  Se quiser rodar o servidor protótipo (scripts/server.js) instale:
   ```bash
   npm install express body-parser
   ```

### Executando na Web

1. Navegue até a pasta do projeto:
   ```bash
   cd "Parte 2\EngSoftware"
   ```

2. Instale todas as dependências:
   ```bash
   npm install
   ```

3. Inicie o projeto específico para web:
   ```bash
   npx expo start --web
   ```

## Executando o Servidor Protótipo (API)

O projeto inclui um servidor de backend protótipo (API) que é usado para simular a comunicação com um banco de dados (lendo e escrevendo no `db.json`).

O aplicativo Expo (web ou mobile) precisará que este servidor esteja rodando para buscar e salvar dados.

1.  **Instale as dependências do servidor** (só precisa fazer uma vez):
    ```bash
    npm install express body-parser
    ```

2.  **Inicie o servidor** (em um terminal separado):
    ```bash
    node scripts/server.js
    ```

3.  Se tudo funcionar, você verá a confirmação no terminal:
    ```
    Server running on http://localhost:3000
    ```

Isso indica que sua API está no ar e pronta para receber requisições.

**Nota**: Em caso de erros, verifique:
- O console do navegador (F12)
- O terminal do VS Code
- Se todas as dependências foram instaladas corretamente
- Se você está no diretório correto do projeto

## Saiba mais

Para aprender mais sobre o desenvolvimento do seu projeto com Expo, consulte os seguintes recursos:

- [Documentação do Expo](https://docs.expo.dev/): Aprenda os fundamentos ou explore tópicos avançados com nossos [guias](https://docs.expo.dev/guides).
- [Tutorial Aprenda Expo](https://docs.expo.dev/tutorial/introduction/): Siga um tutorial passo a passo onde você criará um projeto que funciona no Android, iOS e web.