## Apêndice C: Cenários de Testes Funcionais - Gabriel

Abaixo estão os cenários de validação para as funcionalidades implementadas por Gabriel, documentando o comportamento esperado nas validações de email e categoria.

### 1. Funcionalidade: Validação de Email no Registro
**Cenário:** Registro com Email Inválido
- **Dado que** um usuário tenta se registrar com email malformado `emailsemarroba.com`.
- **Quando** o usuário envia uma requisição `POST` para `/auth/register` com email sem `@`.
- **Então** o sistema deve retornar status **400 (Bad Request)** e mensagem específica `"Email deve conter @"`.

**Cenário:** Registro com Email Válido
- **Dado que** um usuário tenta se registrar com email válido `usuario@exemplo.com`.
- **Quando** o usuário envia uma requisição `POST` para `/auth/register` com credenciais corretas.
- **Então** o sistema deve retornar status **201 (Created)** e objeto contendo `userId` e `email` confirmando o cadastro.

### 2. Funcionalidade: Validação de Categoria em Hábitos
**Cenário:** Criação de Hábito com Categoria Inválida
- **Dado que** o usuário está autenticado com Token JWT válido.
- **Quando** envia um `POST` para `/habits` com categoria inexistente `"CategoriaInventada"`.
- **Então** o sistema deve retornar status **400 (Bad Request)** e lista das categorias válidas: `"Saúde, Produtividade, Estudos, Exercícios, Bem-estar, Financeiro"`.

**Cenário:** Criação de Hábito com Categoria Válida
- **Dado que** o usuário está autenticado com Token JWT válido.
- **Quando** envia um `POST` para `/habits` com categoria válida `"Saúde"`.
- **Então** o sistema deve persistir o hábito no banco e retornar status **201 (Created)** com dados do hábito criado.

---

## Apêndice D: Relatório de Cobertura de Testes - Gabriel

Tabela consolidada das funcionalidades implementadas e verificadas através de TDD.

| Funcionalidade | Arquivos Analisados | Demandas Cobertas |
| :--- | :--- | :--- |
| **Validação de Email** | `src/utils/emailValidator.js`<br>`src/controllers/auth.controller.js` | • Validação de formato de email<br>• Rejeição de emails vazios<br>• Verificação de presença do @<br>• Integração com registro de usuários<br>• 12 testes automatizados (100% cobertura) |
| **Validação de Categoria** | `src/utils/categoryValidator.js`<br>`src/controllers/habit.controller.js` | • Whitelist de categorias permitidas<br>• Validação de tamanho mínimo<br>• Rejeição de categorias vazias<br>• Integração com criação de hábitos<br>• 8 testes automatizados (100% cobertura) |
| **Refatoração de Controllers** | `src/controllers/auth.controller.js`<br>`src/controllers/habit.controller.js` | • Implementação de Fail Fast<br>• Mensagens de erro específicas<br>• Padrão Strategy Pattern<br>• Validação na camada de entrada |

---