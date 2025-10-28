## Objetivo

Criar um ambiente digital que torne o desenvolvimento pessoal mais atraente e sustentável. Ao unir a tecnologia com a interação social positiva, o software visa ser um catalisador para a disciplina e o foco, ajudando os usuários a alcançarem seus objetivos de forma consistente e motivadora.

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

### 📁 Organização dos Diretórios

```
├── 📁 Parte 2/
│   ├── 📁 docs/
│   │   ├── 📁 arquitetura/
│   │   ├── 📁 db/
│   │   ├── 📁 demo/
│   │   ├── 📁 padroes/
│   │   ├── 📁 qualidade/
│   │   ├── 📄 conceitoFuncoes.md
│   │   ├── 📄 conceitoRotas.md
│   │   ├── 📄 metadata.json
│   │   ├── 📄 demonstração.pdf
│   │   └── 📄 EngSoftwareSlides.pdf
│   ├── 📁 EngSoftware/
│   │   ├── 📁 expo/
│   │   ├── 📁 app/
│   │   ├── 📁 app-example/
│   │   ├── 📁 assets/
│   │   ├── 📁 Backend/
│   │   ├── 📁 components/
│   │   ├── 📁 constants/
│   │   ├── 📁 FrontEnd/
│   │   ├── 📁 hooks/
│   │   ├── 📁 node_modules/
│   │   ├── 📁 services/
│   │   ├── 📄 .gitignore
│   │   ├── 📄 app.json
│   │   ├── 📄 eslint.config.js
│   │   ├── 📄 expo-env.d.ts
│   │   ├── 📄 package-lock.json
│   │   ├── 📄 package.json
│   │   ├── 📄 README.md
│   │   └── 📄 tsconfig.json
│   ├── 📁 node_modules/ 
│   ├── 📄 .gitignore    
│   ├── 📄 globals.css
│   ├── 📄 README.md
│   └── 📄 Tarefas.md
```