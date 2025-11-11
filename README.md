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
│   └── 📁 Plano de Gerenciamento/            # Gerenciamento de requisitos
│
├── 📁 Parte 2/                               # Arquitetura e Implementação
│   ├── 📄 README.md                          # Visão geral da Parte 2
│   ├── 📄 Tarefas.md                         # Divisão de tarefas da equipe
│   ├── 📁 docs/                              # Documentação técnica
│   │   ├── 📁 arquitetura/                   # Decisões e diagramas
│   │   ├── 📁 padroes/                       # Padrões de projeto
│   │   ├── 📁 qualidade/                     # Plano de gestão da qualidade
│   │   ├── 📁 demo/                          # Demonstração e slides
│   │   └── 📁 db/                            # Scripts de banco de dados
│   └── 📁 EngSoftware/                       # Código-fonte
│       ├── 📄 README.md                      # Guia de inicialização
│       ├── 📁 Backend/                       # API Node.js/Express
│       │   ├── 📄 README.md                  # Documentação do backend
│       │   └── 📁 src/                       # Código-fonte do backend
│       ├── 📁 app/                           # Aplicação React/Expo
│       ├── 📁 components/                    # Componentes reutilizáveis
│       └── 📁 services/                      # Serviços de integração
│
├── 📁 Parte 3/                               # Testes e Qualidade
│   └── 📄 testes.md                          # Plano de testes e cenários
│       ├── Apêndice B: Plano de Testes       # Visão geral e equipe
│       └── Apêndice C: Cenários de Testes    # Cenários por desenvolvedor
│           ├── Testes Gabriel (Notificações)
│           ├── Testes Leonardo (Coringas)
│           └── Testes Tiago (Autenticação)

```

---

## 📚 Navegação Rápida

### Parte 1 - Levantamento de Requisitos
- **[README Parte 1](./Parte%201/README.md)** - Documentação completa da fase de requisitos
- Entrevistas, histórias de usuário, protótipos e especificação de requisitos

### Parte 2 - Arquitetura e Implementação
- **[README Parte 2](./Parte%202/README.md)** - Documentação de arquitetura e código
- Decisões arquiteturais, padrões de projeto e implementação funcional
- **[Guia de Inicialização](./Parte%202/EngSoftware/README.md)** - Como executar o projeto

### Parte 3 - Testes e Qualidade
- **[Plano de Testes](./Parte%203/testes.md)** - Estratégia e cenários de teste
- Testes funcionais do backend (Autenticação, Notificações, Coringas)