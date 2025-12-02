# 🛠️ Trabalho 3: Testes, Manutenção e TDD

Este diretório contém os entregáveis referentes à **Terceira Entrega** da disciplina de Engenharia de Software. O foco desta etapa foi a garantia de qualidade (QA), refatoração de código legado e implementação de novas funcionalidades utilizando TDD (Test Driven Development).

---

## 📂 1. Entregáveis de Testes (60% da Nota)

### 📖 **Documentação de Cenários (10%)**
- **[📊 Plano de Testes Geral](docs/testes.md)** - Documentação consolidada dos cenários de teste
- **[📄 Cenários Gabriel](docs/testeGabriel.md)** - Email e Categoria de Hábitos
- **[📄 Cenários Leonardo](docs/testeLeonardo.md)** - Lista de Amigos e Hábitos Expirados
- **[📄 Cenários Tiago](docs/testeTiago.md)** - Senha Forte e Validação de Hábitos

### 💻 **Implementação de Testes (10%)**
- **[🧪 Suite de Testes Backend](../../Parte%202/EngSoftware/Backend/src/testes/)** - Testes automatizados organizados por desenvolvedor
  - `Gabriel/` - emailValidator.test.js, categoryValidator.test.js
  - `Leonardo/` - sendFriendRequest.test.js, hideExpiredHabits.test.js
  - `Tiago/` - passwordValidator.test.js, habitValidator.test.js
- **Como executar:** `cd "../Parte 2/EngSoftware/Backend" && npm test`

### 📊 **Relatório de Testes (10%)**
- **[📝 Relatório Gabriel](testes/testesGabriel.md)** - TDD Email e Categoria + Refatoração AuthController
- **[📝 Relatório Leonardo](testes/testesLeonardo.md)** - TDD Lista de Amigos + Sistema de Hábitos Expirados
- **[📝 Relatório Tiago](testes/testesTiago.md)** - TDD Senha Forte + Validação de Campos + Refatoração HabitController

### 🔄 **TDD - Novas Funcionalidades (20%)**

#### Gabriel - Validação e Categorização
- **✅ Validação de Email:** 5 regras de validação (obrigatório, @, formato, domínio)
- **✅ Validação de Categoria:** Whitelist com 6 categorias permitidas (Saúde, Produtividade, etc.)
- **🔧 Integração:** AuthController (register) e HabitController (createHabit)

#### Leonardo - Social e Expiração
- **✅ Sistema de Amizade:** Validação de solicitações (usuário existe, já amigo, já enviou)
- **✅ Hábitos Expirados:** Filtro para ocultar hábitos expirados + feedback visual
- **🔧 Integração:** FrontEnd com ícones de categoria e controle de expiração

#### Tiago - Segurança e Validação
- **✅ Senha Forte:** Validação com 4 critérios (tamanho, maiúscula, minúscula, número)
- **✅ Validação de Hábito:** Campos obrigatórios (título min 5 chars, categoria)
- **🔧 Integração:** AuthController (register) e HabitController (createHabit + checkin)

### 🧪 **Testes do Sistema Final (10%)**
- **[📋 Plano de Testes Completo](docs/testes.md)** - Cenários integrados do sistema
- **[📸 Evidências Visuais](testes/arquivos/)** - Screenshots dos testes executados (20+ capturas)

---

## 🛠️ 2. Entregáveis de Manutenção (40% da Nota)

### 🐛 **Correção de Bugs (10%)**

#### Melhorias no AuthController
- **✅ Tratamento de Erro HTTP:** Códigos semânticos (409 para conflito, 500 para servidor)
- **✅ Validação Fail-Fast:** Email e senha validados antes do Service
- **✅ Logs de Debug:** Console.error para rastreamento de erros

#### Melhorias no HabitController
- **✅ Validação de ID:** parseInt com verificação NaN e valores negativos
- **✅ Tratamento de Estados:** Códigos HTTP específicos (404, 400, 500)
- **✅ Validação de Categoria:** Integração com categoryValidator

### 🔧 **Refatoração com TDD (10%)**

#### Strategy Pattern nos Validadores
- **✅ emailValidator.js:** Lista de regras declarativas
- **✅ passwordValidator.js:** Refatoração de if's para filter/map funcional
- **✅ categoryValidator.js:** Whitelist extensível
- **✅ habitValidator.js:** Validações de campos obrigatórios

#### Padrão de Resposta Unificado
```javascript
// Estrutura padronizada em todos os validadores
{
  isValid: boolean,
  errors: string[]
}
```

### 🔗 **Integração T2 + T3 (10%)**
- **✅ Sistema Backend Integrado:** [EngSoftware Backend](../../Parte%202/EngSoftware/Backend/)
- **✅ Sistema Frontend Integrado:** [EngSoftware FrontEnd](../../Parte%202/EngSoftware/FrontEnd/)
- **✅ Funcionalidades Completas:** 
  - Autenticação com validações
  - CRUD de Hábitos com categorização
  - Sistema de amizade
  - Notificações (da Parte 2)
  - Ícones de categoria no FrontEnd

### 📈 **Refatorações Gerais (10%)**
- **✅ Padrões da Parte 2:** Observer, Strategy, Command mantidos e expandidos
- **✅ Estrutura de Arquivos:** Organização clara em `src/utils/` e `src/testes/`
- **✅ Documentação Técnica:** Relatórios detalhados com justificativas arquiteturais
- **✅ Evidências Visuais:** 20+ screenshots organizados por desenvolvedor

---

## 📽️ 3. Demonstração (10% da Nota)

### 🎥 **Vídeo Demonstrativo (5%)**
- **Caminho:** https://drive.google.com/drive/folders/1OViUJmNA_zzRIeN-0zCHHcPu7DQsfdbt?usp=sharing
### 📑 **Slides PDF (5%)**
- **[📊 Apresentação](docs/Trabalho%203.pdf)** - 6 slides obrigatórios
- **Caminho:** https://drive.google.com/drive/folders/1OViUJmNA_zzRIeN-0zCHHcPu7DQsfdbt?usp=sharing

---


## ⚡ Como Executar os Testes (TDD)

Para validar todos os ciclos de TDD implementados nesta entrega:

```bash
# 1. Navegue até o Backend
cd "Parte 2/EngSoftware/Backend"

# 2. Instale dependências (se necessário)
npm install

# 3. Execute todos os testes
npm test

# 4. Para testes específicos:
npm test -- --testPathPattern=Gabriel
npm test -- --testPathPattern=Leonardo  
npm test -- --testPathPattern=Tiago
```

**✅ Resultado Esperado:**
- `emailValidator.test.js` - ✅ 7 testes PASS
- `categoryValidator.test.js` - ✅ 6 testes PASS  
- `passwordValidator.test.js` - ✅ 9 testes PASS
- `habitValidator.test.js` - ✅ 4 testes PASS
- `sendFriendRequest.test.js` - ✅ 4 testes PASS
- `hideExpiredHabits.test.js` - ✅ 4 testes PASS

**📊 Total: 34 testes automatizados**

---

## 📂 Organização do Projeto (Entrega T3)

```text
Parte 3/
├── README.md                           # (Este arquivo) Guia completo da entrega
├── docs/                               # Documentação Técnica Consolidada
│   ├── testes.md                       # Plano de Testes Geral (Equipe + Infra)
│   ├── testeGabriel.md                 # Cenários - Email e Categoria  
│   ├── testeLeonardo.md                # Cenários - Amigos e Expiração
│   ├── testeTiago.md                   # Cenários - Senha e Validação
│   ├── tarefasT3.md                    # Checklist de entregas
│   └── Trabalho 3.pdf                  # Slides da Apresentação (6 slides)
└── testes/                             # Relatórios Técnicos Detalhados
    ├── testesGabriel.md                # TDD Email/Categoria + Refatoração Auth
    ├── testesLeonardo.md               # TDD Amigos/Expiração + Interface  
    ├── testesTiago.md                  # TDD Senha/Validação + Refatoração Habit
    └── arquivos/                       # Evidências Visuais Organizadas
        ├── Gabriel/                    # 8 screenshots (TDD + Postman)
        │   ├── RED_auth.png, GREEN.png, teste_auth.png
        │   ├── authController_Novo.png, habitController_novo.png
        │   └── ...
        ├── Leonardo/                   # 9 screenshots (Amigos + UI)
        │   ├── MainWindow.png, RED.png, passou.png
        │   ├── expirou.png, ocultar.png, resposta_testes.png  
        │   └── ...
        └── Tiago/                      # 8 screenshots (Senha + Validação)
            ├── TDD_senha_RED.png, TDD_senha_GREEN.png
            ├── authCerto.png, authErrado.png, passwordValidator.png
            └── ...
```

### 🔗 Estrutura de Código (Backend)
```text
Parte 2/EngSoftware/Backend/src/
├── controllers/
│   ├── auth.controller.js              # ✅ Refatorado (Gabriel + Tiago)
│   └── habit.controller.js             # ✅ Refatorado (Gabriel + Tiago)  
├── utils/                              # 🆕 Validadores Criados
│   ├── emailValidator.js               # Gabriel - 5 regras
│   ├── categoryValidator.js            # Gabriel - 6 categorias
│   ├── passwordValidator.js            # Tiago - 4 critérios
│   ├── habitValidator.js               # Tiago - campos obrigatórios
│   └── FriendRequestService.js         # Leonardo - lógica amizade
└── testes/                             # 🆕 Testes TDD Organizados
    ├── Gabriel/
    │   ├── emailValidator.test.js       # 7 testes
    │   └── categoryValidator.test.js    # 6 testes
    ├── Leonardo/  
    │   ├── sendFriendRequest.test.js    # 4 testes
    │   └── hideExpiredHabits.test.js    # 4 testes
    └── Tiago/
        ├── passwordValidator.test.js    # 9 testes  
        └── habitValidator.test.js       # 4 testes
```

> **📌 Nota:** O código fonte modificado encontra-se na pasta `Parte 2/EngSoftware`, mantendo a estrutura de desenvolvimento original do projeto.

---

### 🎯 Funcionalidades Implementadas com TDD

#### ✅ Gabriel (Email + Categoria)
- Validação de email com 5 regras
- Sistema de categorias com whitelist
- Integração em AuthController e HabitController
- 13 testes automatizados

#### ✅ Leonardo (Social + Expiração)  
- Sistema de solicitação de amizade
- Controle de hábitos expirados com UI
- Ícones de categoria no frontend
- 8 testes automatizados

#### ✅ Tiago (Segurança + Validação)
- Validação de senha forte (4 critérios)
- Validação de campos de hábito
- Refatoração de tratamento de erros
- 13 testes automatizados

---

## 🔗 Navegação Rápida

- **[← Voltar ao README Principal](../README.md)** - Visão geral do projeto
- **[📋 Lista de Tarefas T3](docs/tarefasT3.md)** - Controle detalhado de entregas
- **[📊 Plano de Testes](docs/testes.md)** - Documentação consolidada da equipe
- **[💻 Código Fonte Backend](../../Parte%202/EngSoftware/Backend/)** - Sistema implementado  
- **[📱 Código Fonte Frontend](../../Parte%202/EngSoftware/FrontEnd/)** - Interface do usuário
- **[📑 Slides Apresentação](docs/Trabalho%203.pdf)** - Material para workshop presencial

---
