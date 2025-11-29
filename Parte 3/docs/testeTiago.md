## Apêndice C: Cenários de Testes Funcionais

Abaixo estão os cenários de validação para as funcionalidades críticas do sistema, documentando o comportamento esperado.

### 1. Funcionalidade: Autenticação
**Cenário:** Login com Sucesso
- **Dado que** existe um usuário cadastrado com email `joao.silva@email.com` e senha válida no banco de dados.
- **Quando** o usuário envia uma requisição `POST` para `/api/auth/login` com essas credenciais corretas.
- **Então** o sistema deve retornar status **200 (OK)** e um objeto contendo um **Token JWT** válido para acesso às rotas protegidas.

### 2. Funcionalidade: Gestão de Hábitos
**Cenário:** Criação de Hábito com Validação
- **Dado que** o usuário está autenticado com um Token JWT válido.
- **Quando** envia um `POST` para `/api/habits` com Título, Descrição e Categoria preenchidos corretamente.
- **Então** o sistema deve persistir o hábito associado ao ID do usuário no banco e retornar status **201 (Created)** com os dados do registro criado.

---

## Apêndice D: Relatório de Cobertura de Testes

Tabela consolidada das funcionalidades verificadas e seus respectivos módulos no Backend.

| Funcionalidade | Arquivos Analisados | Demandas Cobertas |
| :--- | :--- | :--- |
| **Autenticação** | `src/controllers/authController.js`<br>`src/middleware/authMiddleware.js` | • Registro de usuários (Hash bcrypt)<br>• Login e Geração de JWT<br>• Middleware de proteção de rotas<br>• Tratamento de erros |
| **Gestão de Hábitos** | `src/controllers/habitController.js`<br>`src/models/habitModel.js` | • CRUD Completo (Criar, Ler, Atualizar, Deletar)<br>• Validação de Ownership (Usuário só edita o que é dele)<br>• Persistência de dados com Timestamps |