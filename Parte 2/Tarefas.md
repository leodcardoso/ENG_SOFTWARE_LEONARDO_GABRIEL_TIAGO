# Parte 2 — Plano e Divisão de Tarefas

1) Documentação (README/git) — 35%

1.1 Gerência de Qualidade (5%) — Owner: Gabriel | Review: Leonardo, Tiago
- [x] Especificar papéis e responsabilidades (Dev, Arquiteto, QA, Reviewer)
- [x] Definir padrões de documentação (estrutura de pastas, estilo Markdown, checklist de PR)
- [x] Definir ferramentas e padrões de desenvolvimento (Git flow, convenção de commits, linters, formatação)
- [x] Definir padrões não funcionais (segurança básica, logs, tratamento de erros, performance mínima)
- [x] Definir processos (gestão de atividades no Trello, revisão de documentos, code review, integração)
- [x] Definir atividades e métricas de QA (cobertura mínima, checklist de aceite, métricas de bugs)
- [x] Publicar no README um resumo + links para o plano completo
  - Arquivo(s): docs/qualidade/Plano_de_Gestao_da_Qualidade.md e resumo no README.md

1.2 Decisões Arquiteturais e Justificativas (5%) — Owner: Leonardo | Review: Gabriel
- [x] Analisar requisitos do projeto (HU e protótipos)
- [x] Escolher padrão de arquitetura base (ex.: Camadas para Web: UI → API → Serviço → Repositório)
- [x] Justificar escolhas (trade-offs, simplicidade, aderência ao escopo e prazos)
- [x] Definir tecnologias (ex.: Front: React/Vite; Back: Node/Express; DB: SQLite/PostgreSQL)
- [x] Criar documento de decisões (ADRs) e referenciar no README
  - Arquivo(s): docs/arquitetura/Decisoes_de_Arquitetura.md

1.3 Diagrama de Arquitetura (5%) — Owner: Leonardo | Review: Tiago
- [x] Diagramar camadas, componentes e integrações (cliente, API, DB)
- [x] Exportar em SVG/PNG e disponibilizar a fonte (ex.: .drawio)
  - Arquivo(s): docs/arquitetura/Diagrama_Arquitetura.drawio e docs/arquitetura/Diagrama_Arquitetura.svg

1.4 Padrões de Projeto e Justificativas (10%) — Owner: Tiago | Review: Leonardo
- [x] Selecionar padrões aderentes ao escopo (mín. 1 por integrante)
  - Sugestões:
    - Gabriel: Observer (eventos de hábitos/notificações)
    - Leonardo: Strategy (cálculo de pontuação/níveis ou ranking)
    - Tiago: Command (registro/desfazer ações como “coringa”) ou Decorator (privacidade)
- [x] Justificar escolhas e onde serão aplicadas no código
  - Arquivo: docs/padroes/Decisoes_de_Padroes.md

1.5 Diagramas dos Padrões + Mapeamento para o Código (10%) — Owner: Tiago | Review: Gabriel
- [x] Diagramar cada padrão (UML simples) e apontar classes/módulos reais
  - Arquivos: docs/padroes/Observer.svg, docs/padroes/Strategy.svg, docs/padroes/Command.svg (ou Decorator.svg)
- [x] Garantir alinhamento dos diagramas com o código final

2) Código (Pasta específica) — 55%

2.1 Versão funcional conforme requisitos (35%) — Owners por HU abaixo | Review cruzado
- Gabriel
  - [x] Notificações (agendamento simples/local; integração com Observer)
  - [x] Interface social básica (lista de amigos, feed simples)
- Leonardo
  - [x] Lembretes (camada de serviço, configuração por hábito)
  - [x] Ranking (cálculo e exibição, integração Strategy se aplicável)
  - [x] “Coringa” (usar uma isenção/dia por período)
- Tiago
  - [x] Desafios (criar/entrar, progresso)
  - [x] Privacidade (escopo de visibilidade: privado/amigos/público)
  - [x] Troféus/Conquistas (desbloqueio por metas)
- [x] Fluxos mínimos utilizáveis por usuário (criar hábito, check-in diário, pontuar, ver ranking/desafios)

2.2 Arquivos comentados (5%) — Owner: Gabriel | Review: Todos
- [x] Definir padrão de comentários (ex.: JSDoc em serviços e controllers)
- [x] Adotar cabeçalho de arquivo (propósito, autor, data)
- [x] Revisão para garantir clareza/consistência

2.3 Ao menos um padrão de projeto por integrante (15%) — Owners: cada um
- Gabriel 
  - [x] Event bus para eventos de hábito (check-in, lembrete disparado)
  - [x] Observers: UI/Notificações/Logs
- Leonardo
  - [x] Estratégias de pontuação/níveis (ex.: padrão, conservador, agressivo) OU ranking
  - [x] Injeção da estratégia via configuração
- Tiago
  - [x] Comandos para ações do usuário (check-in, usar “coringa”, reverter)
  - [x] Histórico de comandos para auditoria/desfazer
- [x] Documentar no código onde o padrão está aplicado (comentário com referência ao diagrama)

3) Demonstração (PDF no git) — 10%

3.1 Vídeo (até 30s) — Owner: Tiago | Review: Leonardo
- [x] Gravar fluxo principal funcionando
- [x] Hospedar (link não listado) e inserir no PDF
  - Arquivo: docs/demo/Demonstracao.pdf (contém o link)

3.2 Slides (6) — Owner: Gabriel | Review: Todos
- [x] i) Título, autores
- [x] ii) Objetivo
- [x] iii) Arquitetura
- [x] iv, v, vi) Diagrama do padrão + classes do código de cada integrante
  - Arquivo(s): docs/demo/slides/Parte2_Slides.pdf (ou fonte .pptx e export .pdf)

4) Gestão, Processo e Rastreabilidade

- ~~[ ] Atualizar Trello com todas as tarefas acima e responsáveis~~
- [x] Definir critérios de “Pronto” (DoD) por item (doc revisado, PR aprovado, build ok)
- [x] Abrir issues no Git para cada tarefa e vincular PRs
- ~~[ ] Criar CHANGELOG.md e registrar mudanças relevantes~~
- [x] Checkpoints da equipe (ex.: 2 reuniões/semana) com notas rápidas em docs/processo/Diarios_de_Bordo.md

Entregáveis esperados no repositório

- README.md atualizado com sumário e links
- docs/qualidade/Plano_de_Gestao_da_Qualidade.md
- docs/arquitetura/Decisoes_de_Arquitetura.md
- docs/arquitetura/Diagrama_Arquitetura.drawio + .svg
- docs/padroes/Decisoes_de_Padroes.md
- docs/padroes/*.svg (Observer, Strategy, Command/Decorator)
- docs/demo/Demonstracao.pdf e slides
- CHANGELOG.md