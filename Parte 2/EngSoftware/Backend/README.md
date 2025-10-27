# Meu Projeto Node.js com PostgreSQL

Este projeto é uma aplicação Node.js que utiliza PostgreSQL como banco de dados. Abaixo estão as instruções para instalação e uso.

## Pré-requisitos

- Node.js (v14 ou superior)
- PostgreSQL (v12 ou superior)
- Docker (opcional, para uso com Docker)

## Instalação

1. Clone o repositório:

   ```
   git clone <URL_DO_REPOSITORIO>
   cd meu-projeto-node-postgres
   ```

2. Instale as dependências:

   ```
   npm install
   ```

3. Configure o banco de dados:

   - Crie um banco de dados no PostgreSQL.
   - Renomeie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente conforme necessário.

4. Execute as migrações:

   ```
   psql -U <USUARIO> -d <NOME_DO_BANCO> -f migrations/001_init.sql
   ```

## Uso

Para iniciar o servidor, utilize o Nodemon:

```
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

- `src/server.js`: Ponto de entrada da aplicação.
- `src/config/db.js`: Configuração da conexão com o banco de dados.
- `src/controllers/index.js`: Lógica de negócios da aplicação.
- `src/routes/index.js`: Definição das rotas da aplicação.
- `src/models/index.js`: Modelos de dados que representam as tabelas do banco de dados.
- `src/services/index.js`: Lógica de serviços utilizados pelos controladores.
- `migrations/001_init.sql`: Script SQL para inicializar o banco de dados.
- `docker-compose.yml`: Configuração do Docker para a aplicação.
- `Dockerfile`: Instruções para construir a imagem Docker.
- `.env.example`: Exemplo de variáveis de ambiente.
- `.gitignore`: Arquivos e pastas a serem ignorados pelo controle de versão.
- `nodemon.json`: Configuração do Nodemon.
- `package.json`: Configuração do npm.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Faça um fork do repositório e envie um pull request.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.