## 1\. Manutenção e Refatoração (40% da Nota)

Nesta etapa, o código legado foi analisado em busca de "Code Smells". As intervenções focaram em melhorar a semântica HTTP e a segurança contra dados inválidos.

### 1.1. Refatoração de Autenticação (`auth.controller.js`)

  * **Problema:** Tratamento de erro genérico (`400`) mascarava falhas críticas.
  * **Solução:** Implementação de tratamento condicional (`409` para conflito, `500` para erro de servidor).

<!-- end list -->

```javascript
// 🟢 DEPOIS (Semântico)
} catch (error) {
  let statusCode = 400; 

  if (error.message.includes('já cadastrado')) {
    statusCode = 409; // Conflict
  } else if (error.message.includes('ECONNREFUSED')) {
    statusCode = 500; // Internal Server Error
  }

  return res.status(statusCode).json({ success: false, message: error.message });
}
```

> **[PRINT DO CÓDIGO NO VS CODE]**

-----

### 1.2. Refatoração de Hábitos (`habit.controller.js`)

  * **Problema:** O método `checkin` não validava o tipo do ID recebido na URL.
  * **Solução:** Aplicação do padrão **Fail Fast** com validação de tipo.

<!-- end list -->

```javascript
// 🟢 DEPOIS (Com Validação de Segurança)
const { habitId } = req.params;
const parsedId = parseInt(habitId, 10);

if (isNaN(parsedId) || parsedId <= 0) {
  return res.status(400).json({ success: false, message: 'ID inválido.' });
}

const result = await HabitService.checkin(parsedId, userId);
```

> **[PRINT DA VALIDAÇÃO]**

-----

## 2\. TDD 1: Validação de Senha Forte (Autenticação)

**Objetivo:** Impedir cadastro com senhas fracas.
**Arquivo:** `src/utils/tiago/passwordValidator.js`

[Image of TDD cycle red green refactor]

### 🔴 Fase 1: RED (O Teste que Falha)

Teste criado esperando a função `validateStrongPassword`, que ainda não existia.

  * **Erro:** `Cannot find module`.

> **[PRINT DO TERMINAL VERMELHO]**

### 🟢 Fase 2: GREEN (Funciona, mas Simples)

Implementação inicial "ingênua" apenas para fazer o teste passar (uso de múltiplos `if`s).

```javascript
function validateStrongPassword(password) {
  const errors = [];
  // Implementação procedural simples
  if (!password) return { isValid: false, errors: ['Senha vazia'] };
  if (password.length < 8) errors.push('Mínimo de 8 caracteres');
  if (!/\d/.test(password)) errors.push('Deve conter número');
  
  return { isValid: errors.length === 0, errors };
}
```

> **[PRINT DO TERMINAL VERDE]**

### 🔵 Fase 3: REFACTOR (Melhoria Arquitetural)

Evolução do código para um padrão mais extensível (Strategy Pattern com lista de regras), facilitando a adição de novas validações futuras sem alterar a lógica principal.

```javascript
// Lista de regras declarativa
const rules = [
  { test: (pwd) => pwd.length >= 8, message: 'Mínimo de 8 caracteres' },
  { test: (pwd) => /\d/.test(pwd), message: 'Deve conter número' }
];

function validateStrongPassword(password) {
  if (!password) return { isValid: false, errors: ['Senha vazia'] };

  // Programação funcional: Filtra regras violadas
  const errors = rules
    .filter(rule => !rule.test(password))
    .map(rule => rule.message);

  return { isValid: errors.length === 0, errors };
}
```

> **[PRINT DO CÓDIGO REFATORADO]**

-----

## 3\. TDD 2: Validação de Hábito (Core)

**Objetivo:** Garantir integridade de dados na criação de hábitos.
**Arquivo:** `src/utils/tiago/habitValidator.js`

### 🔴 Fase 1: RED

Teste criado exigindo validação de título (min 5 chars) e categoria.

> **[PRINT DO TERMINAL VERMELHO]**

### 🟢 Fase 2: GREEN

Implementação da lógica de validação.

```javascript
function validarCamposHabito(titulo, categoria) {
  if (!titulo || titulo.length < 5) {
    return { valido: false, erro: 'Título inválido (min 5 chars)' };
  }
  if (!categoria) {
    return { valido: false, erro: 'Categoria obrigatória' };
  }
  return { valido: true, erro: null };
}
```

> **[PRINT DO TERMINAL VERDE]**

### 🔵 Fase 3: REFACTOR (Padronização de Interface)
**Melhoria:** O código foi refatorado para retornar `{ isValid, errors: [] }`, padronizando a comunicação com o Frontend e alinhando com a estrutura do Validador de Senha.

```javascript

function validarCamposHabito(titulo, categoria) {
  if (!titulo || titulo.trim() === '') {
    return { valido: false, erro: 'Título é obrigatório' };
  }
  if (titulo.length < 5) {
    return { valido: false, erro: 'Título deve ter pelo menos 5 caracteres' };
  }
  if (!categoria || categoria.trim() === '') {
    return { valido: false, erro: 'Categoria é obrigatória' };
  }
  return { valido: true, erro: null };
}

```

> **[PRINT DO CÓDIGO REFATORADO E TESTE VERDE]**

-----

## 4\. Justificativas Técnicas

### 4.1. Por que Refatorar o Validador de Senha?

A versão inicial (Green) utilizava programação imperativa com múltiplos `if`s. A versão refatorada (Refactor) utiliza uma estrutura de dados (`rules`) e métodos de array (`filter`, `map`). Isso torna o código mais **Declarativo** e segue o princípio **Open/Closed** (aberto para extensão, fechado para modificação), pois novas regras de senha podem ser adicionadas apenas incluindo um objeto no array, sem tocar na função validadora.

### 4.2. Padrão "Fail Fast"

A validação de IDs nos Controllers evita que dados sujos cheguem à camada de serviço ou banco de dados, economizando recursos e prevenindo exceções não tratadas.

## **Checklist Tiago**.

### 📂 1. Entregáveis de Testes (60% da Nota)
* [x] **Readme (Cenários - Apêndice C):** `[CONCLUÍDO]` ✅ (Documentado no arquivo final).
* [x] **Readme (Relatório - Apêndice D):** `[CONCLUÍDO]` ✅ (Tabela de cobertura salva).
* [x] **Readme (Plano de Testes - Apêndice B):** `[CONCLUÍDO]` ✅ (Texto com divisão de tarefas salvo).
* [x] **Code + TDD (Nova Funcionalidade):** `[CONCLUÍDO]` ✅
    * *Entregue:* Validador de Senha (Tiago) e Validador de Hábito (Extra).
    * *Evidência:* Ciclos Red/Green/Refactor completos e commitados.

### 🛠️ 2. Entregáveis de Manutenção (40% da Nota)
* [x] **Code (Refatoração - Auth):** `[CONCLUÍDO]` ✅ (Tratamento de erros 400/409/500).
* [x] **Code (Refatoração - Hábitos):** `[CONCLUÍDO]` ✅ (Validação de ID `parseInt`).
* [x] **Code (Integração):** `[CONCLUÍDO]` ✅ (Validador de senha ligado ao Registro).

---

### 📽️ 3. Demonstração (10% da Nota) - **🔴 O QUE FALTA**
Estes são os únicos itens pendentes para você fechar o notebook:

* [ ] **Slides (PDF):** `[PENDENTE]`
    * *O que fazer:* Montar o PDF com 6 slides contendo os prints que você tirou (Red/Green/Refactor) e o texto do Plano de Testes.
    
    #### 📉 Slide 3: Plano de Testes

    * **Estratégia de QA:**
        * Testes Unitários (Jest) para validação de regras de negócio críticas.
        * Testes de Integração (Supertest) para segurança da API.
    * **Divisão de Responsabilidades (TDD):**
        * **Gabriel:** .
        * **Leonardo:** .
        * **Tiago:** Segurança (Auth), Validações de Entrada e Core Backend.
    * **Ferramentas:** `Jest`, `Supertest`, `Postman`, `GitHub Actions`.

    ---

    ####  Slide 4: TDD (Gabriel)
    ####  Slide 5: TDD (Leonardo)

    ---

    ####  Slide 6: TDD (Tiago)

    * **Título:** `TDD & Refatoração Backend (Tiago)`

    ##### **Coluna 1: TDD de Segurança (Senha)**
    * **Contexto:** "Validador de Força de Senha (Strategy Pattern)".
    * **Evidências (Seus Prints):**
        1.  🔴 **RED:** Print do terminal com erro `Cannot find module` ou falha de asserção.
        2.  🟢 **GREEN:** Print do terminal com `PASS` e os testes ticados.
        3.  🔵 **CODE:** Print do código final refatorado (aquele com a lista `rules = [...]`).

    ##### **Coluna 2: Manutenção e Fail Fast (Hábitos)**
    * **Contexto:** "Proteção da API contra Injeção/Erros".
    * **Evidências:**
        1.  🔴 **ANTES:** Print do código antigo (vulnerável).
        2.  🟢 **DEPOIS:** Print do código novo com `parseInt` e validação.
        3.  **Resultado:** Pequeno print do Postman mostrando o erro `400` personalizado.