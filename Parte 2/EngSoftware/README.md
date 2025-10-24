# Bem-vindo ao seu aplicativo Expo 👋

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