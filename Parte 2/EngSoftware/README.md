# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

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

// ...existing code...

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

**Nota**: Em caso de erros, verifique:
- O console do navegador (F12)
- O terminal do VS Code
- Se todas as dependências foram instaladas corretamente
- Se você está no diretório correto do projeto

// ...existing code...
