## Objetivo

- Muitas pessoas enfrentam uma dificuldade constante em manter o foco e a disciplina necessários para construir hábitos positivos a longo prazo. A ausência de motivação contínua e de uma rede de apoio eficaz são as principais barreiras que frequentemente levam ao abandono de importantes objetivos pessoais, criando um ciclo de frustração.
- Para enfrentar esse desafio, o projeto propõe o desenvolvimento de um software que utiliza a gamificação como principal ferramenta de engajamento. Através de sistemas de pontos, níveis e recompensas, a plataforma transforma o acompanhamento de metas em uma experiência lúdica, fortalecida pela interação social que incentiva uma competição saudável e um senso de responsabilidade mútua entre amigos.
- O objetivo final é criar um ambiente digital que torne o desenvolvimento pessoal mais atraente e sustentável. Ao unir a tecnologia com a interação social positiva, o software visa ser um catalisador para a disciplina e o foco, ajudando os usuários a alcançarem seus objetivos de forma consistente e motivadora.

## Viabilidade

### Técnica

- O projeto é tecnicamente **viável**, utilizando os seguintes recursos:
  - **Banco de dados** para armazenar hábitos e progresso dos usuários.
  - **JavaScript** para desenvolvimento da interface e lógica.
  - **Acesso à internet** para uso do sistema via web.
  - **Protocolos HTTP/HTTPS** para comunicação entre cliente e servidor.
- O **hardware necessário** para implementação está disponível na universidade.
- Para organização das atividades, será utilizado o **Trello**.
- Para versionamento do código, será utilizado o **GitHub**.

### Temporal

- Com base nas funcionalidades e objetivos definidos, estima-se que o prazo de **um semestre completo** é suficiente para implementar o software proposto, considerando uma equipe de **3 pessoas com conhecimento médio** sobre o assunto.

### Relevância

- Este projeto é relevante por enfrentar o desafio universal da manutenção de hábitos, combatendo o ciclo de frustração que leva ao abandono de metas. Utilizando a gamificação e a interação social, a ferramenta transforma o desenvolvimento pessoal em uma experiência motivadora e colaborativa. Ao fazer isso, o software posiciona a tecnologia como uma forte aliada do bem-estar, oferecendo uma solução prática para promover disciplina, foco e criar uma rede de apoio eficaz entre os usuários.

---

### 📁 Organização dos Diretórios

```
📦 ENG_SOFTWARE_LEONARDO_GABRIEL_TIAGO/
├── 📄 README.md                              # Visão geral do projeto
│
├── 📁 Parte 1/                               # Levantamento de Requisitos (Aulas 4-8)
│   ├── 📄 README.md                          # Visão geral da Parte 1
│   ├── 📁 Artigos/                           # Embasamento teórico
│   ├── 📁 Embasamento/                       # Fundamentação individual
│   ├── 📁 Entrevistas/                       # Entrevistas com usuários
│   ├── 📁 Historias de Usuario e Criterios de Aceitação/
│   ├── 📁 Diagramas/                         # Diagramas de sequência
│   ├── 📁 Prototipos/                        # Protótipos de interface
│   ├── 📁 Revisao/                           # Documentação de revisão
│   ├── 📁 Documento Requisitos/              # Requisitos V1 e V2
│   ├── 📁 Plano de Gerenciamento/            # Gerenciamento de requisitos
│   └── 📁 Tarefas da Materia/                # Planejamento das atividades
│       ├── 📄 tarefasT2.md                   # Tarefas originais da Parte 2
│
├── 📁 Parte 2/                               # Arquitetura e Implementação (Aulas 9-13)
│   ├── 📄 README.md                          # Visão geral da Parte 2
│   ├── 📄 Tarefas.md                         # Divisão de tarefas da equipe
│   ├── 📁 docs/                              # Documentação técnica
│   │   ├── 📁 arquitetura/                   # Decisões e diagramas arquiteturais
│   │   ├── 📁 padroes/                       # Padrões de projeto (Observer, Strategy, Command)
│   │   ├── 📁 qualidade/                     # Plano de gestão da qualidade
│   │   ├── 📁 demo/                          # Demonstração e slides
│   │   │   ├── 📄 NOTA_DEMO.md               # Instruções para demonstração
│   │   │   └── 📁 slides/                    # Slides da apresentação
│   │   ├── 📁 db/                            # Scripts de banco de dados
│   │   ├── 📄 conceitoFuncoes.md             # Documentação de conceitos
│   │   ├── 📄 conceitoRotas.md               # Documentação de rotas
│   │   └── 📄 metadata.json                  # Metadados do projeto
│   └── 📁 EngSoftware/                       # Código-fonte principal
│       ├── 📄 README.md                      # Guia de inicialização
│       ├── 📁 Backend/                       # API Node.js/Express
│       └── 📁 FrontEnd/                      # Aplicação React Native/Expo
│
└── 📁 Parte 3/                               # Testes, Manutenção e TDD (Aulas 14-18)
    ├── 📄 README.md                          # Guia geral da entrega
    ├── 📁 docs/                              # Documentação técnica
    │   ├── 📄 testes.md                      # Plano de Testes Geral
    │   └── 📄 tarefasT3.md                   # Controle de atividades
    └── 📁 testes/                            # Relatórios individuais e evidências
        ├── 📄 testesGabriel.md               # Relatório TDD - Gabriel
        ├── 📄 testesLeonardo.md              # Relatório TDD - Leonardo
        ├── 📄 testesTiago.md                 # Relatório TDD - Tiago
        └── 📁 arquivos/                      # Evidências e capturas de tela
            ├── 📁 Gabriel/                   # Prints e evidências - Gabriel
            ├── 📁 Leonardo/                  # Prints e evidências - Leonardo
            └── 📁 Tiago/                     # Prints e evidências - Tiago

```

---

## 📚 Navegação Rápida

### Parte 1 - Levantamento de Requisitos (Aulas 4-8)
- **[README Parte 1](./Parte%201/README.md)** - Documentação completa da fase de requisitos
- **[Documento de Requisitos V2](./Parte%201/Documento%20Requisitos/DocumentoRequisitos_V2.md)** - Requisitos refinados
- Entrevistas, histórias de usuário, protótipos e especificação de requisitos

### Parte 2 - Arquitetura e Implementação (Aulas 9-13)
- **[README Parte 2](./Parte%202/README.md)** - Documentação de arquitetura e código
- **[Divisão de Tarefas](./Parte%202/Tarefas.md)** - Planejamento e responsabilidades da equipe
- **[Guia de Inicialização](./Parte%202/EngSoftware/README.md)** - Como executar o projeto
- Decisões arquiteturais, padrões de projeto (Observer, Strategy, Command) e implementação funcional

### Parte 3 - Testes, Manutenção e TDD (Aulas 14-18)
- **[README Parte 3](./Parte%203/README.md)** - Guia geral da entrega de testes
- **[Relatório Gabriel](./Parte%203/testes/testesGabriel.md)** - TDD Email e Categoria + Refatoração
- **[Relatório Leonardo](./Parte%203/testes/testesLeonardo.md)** - TDD Lista de Amigos + Hábitos Expirados
- **[Relatório Tiago](./Parte%203/testes/testesTiago.md)** - TDD Senha Forte + Validação de Hábitos
- Estratégias de manutenção, refatoração de código legado e desenvolvimento orientado a testes