# Parte 2 — Plano e Divisão de Tarefas


Observação: Atualizar o Trello com estas tarefas e responsáveis. Vincular issues/PRs no Git a cada item e registrar mudanças em CHANGELOG.md.

1) Documentação (README/git) — 35%

1.1 Gerência de Qualidade (5%) — Owner: Gabriel | Review: Leonardo, Tiago
- [ ] Especificar papéis e responsabilidades (Dev, Arquiteto, QA, Reviewer)
- [ ] Definir padrões de documentação (estrutura de pastas, estilo Markdown, checklist de PR)
- [ ] Definir ferramentas e padrões de desenvolvimento (Git flow, convenção de commits, linters, formatação)
- [ ] Definir padrões não funcionais (segurança básica, logs, tratamento de erros, performance mínima)
- [ ] Definir processos (gestão de atividades no Trello, revisão de documentos, code review, integração)
- [ ] Definir atividades e métricas de QA (cobertura mínima, checklist de aceite, métricas de bugs)
- [ ] Publicar no README um resumo + links para o plano completo
  - Arquivo(s): docs/qualidade/Plano_de_Gestao_da_Qualidade.md e resumo no README.md

1.2 Decisões Arquiteturais e Justificativas (5%) — Owner: Leonardo | Review: Gabriel
- [ ] Analisar requisitos do projeto (HU e protótipos)
- [ ] Escolher padrão de arquitetura base (ex.: Camadas para Web: UI → API → Serviço → Repositório)
- [ ] Justificar escolhas (trade-offs, simplicidade, aderência ao escopo e prazos)
- [ ] Definir tecnologias (ex.: Front: React/Vite; Back: Node/Express; DB: SQLite/PostgreSQL)
- [ ] Criar documento de decisões (ADRs) e referenciar no README
  - Arquivo(s): docs/arquitetura/Decisoes_de_Arquitetura.md

1.3 Diagrama de Arquitetura (5%) — Owner: Leonardo | Review: Tiago
- [ ] Diagramar camadas, componentes e integrações (cliente, API, DB)
- [ ] Exportar em SVG/PNG e disponibilizar a fonte (ex.: .drawio)
  - Arquivo(s): docs/arquitetura/Diagrama_Arquitetura.drawio e docs/arquitetura/Diagrama_Arquitetura.svg

1.4 Padrões de Projeto e Justificativas (10%) — Owner: Tiago | Review: Leonardo
- [ ] Selecionar padrões aderentes ao escopo (mín. 1 por integrante)
  - Sugestões:
    - Gabriel: Observer (eventos de hábitos/notificações)
    - Leonardo: Strategy (cálculo de pontuação/níveis ou ranking)
    - Tiago: Command (registro/desfazer ações como “coringa”) ou Decorator (privacidade)
- [ ] Justificar escolhas e onde serão aplicadas no código
  - Arquivo: docs/padroes/Decisoes_de_Padroes.md

1.5 Diagramas dos Padrões + Mapeamento para o Código (10%) — Owner: Tiago | Review: Gabriel
- [ ] Diagramar cada padrão (UML simples) e apontar classes/módulos reais
  - Arquivos: docs/padroes/Observer.svg, docs/padroes/Strategy.svg, docs/padroes/Command.svg (ou Decorator.svg)
- [ ] Garantir alinhamento dos diagramas com o código final

2) Código (Pasta específica) — 55%

2.1 Versão funcional conforme requisitos (35%) — Owners por HU abaixo | Review cruzado
- Gabriel
  - [ ] Notificações (agendamento simples/local; integração com Observer)
  - [ ] Interface social básica (lista de amigos, feed simples)
- Leonardo
  - [ ] Lembretes (camada de serviço, configuração por hábito)
  - [ ] Ranking (cálculo e exibição, integração Strategy se aplicável)
  - [ ] “Coringa” (usar uma isenção/dia por período)
- Tiago
  - [ ] Desafios (criar/entrar, progresso)
  - [ ] Privacidade (escopo de visibilidade: privado/amigos/público)
  - [ ] Troféus/Conquistas (desbloqueio por metas)
- [ ] Fluxos mínimos utilizáveis por usuário (criar hábito, check-in diário, pontuar, ver ranking/desafios)

2.2 Arquivos comentados (5%) — Owner: Gabriel | Review: Todos
- [ ] Definir padrão de comentários (ex.: JSDoc em serviços e controllers)
- [ ] Adotar cabeçalho de arquivo (propósito, autor, data)
- [ ] Revisão para garantir clareza/consistência

2.3 Ao menos um padrão de projeto por integrante (15%) — Owners: cada um
- Gabriel — Observer
  - [ ] Event bus para eventos de hábito (check-in, lembrete disparado)
  - [ ] Observers: UI/Notificações/Logs
- Leonardo — Strategy
  - [ ] Estratégias de pontuação/níveis (ex.: padrão, conservador, agressivo) OU ranking
  - [ ] Injeção da estratégia via configuração
- Tiago — Command (ou Decorator)
  - [ ] Comandos para ações do usuário (check-in, usar “coringa”, reverter)
  - [ ] Histórico de comandos para auditoria/desfazer
- [ ] Documentar no código onde o padrão está aplicado (comentário com referência ao diagrama)

3) Demonstração (PDF no git) — 10%

3.1 Vídeo (até 30s) — Owner: Tiago | Review: Leonardo
- [ ] Gravar fluxo principal funcionando
- [ ] Hospedar (link não listado) e inserir no PDF
  - Arquivo: docs/demo/Demonstracao.pdf (contém o link)

3.2 Slides (6) — Owner: Gabriel | Review: Todos
- [x] i) Título, autores
- [x] ii) Objetivo
- [ ] iii) Arquitetura
- [ ] iv, v, vi) Diagrama do padrão + classes do código de cada integrante
  - Arquivo(s): docs/demo/slides/Parte2_Slides.pdf (ou fonte .pptx e export .pdf)

4) Gestão, Processo e Rastreabilidade

- [ ] Atualizar Trello com todas as tarefas acima e responsáveis
- [ ] Definir critérios de “Pronto” (DoD) por item (doc revisado, PR aprovado, build ok)
- [ ] Abrir issues no Git para cada tarefa e vincular PRs
- [ ] Criar CHANGELOG.md e registrar mudanças relevantes
- [ ] Checkpoints da equipe (ex.: 2 reuniões/semana) com notas rápidas em docs/processo/Diarios_de_Bordo.md

Entregáveis esperados no repositório

- README.md atualizado com sumário e links
- docs/qualidade/Plano_de_Gestao_da_Qualidade.md
- docs/arquitetura/Decisoes_de_Arquitetura.md
- docs/arquitetura/Diagrama_Arquitetura.drawio + .svg
- docs/padroes/Decisoes_de_Padroes.md
- docs/padroes/*.svg (Observer, Strategy, Command/Decorator)
- docs/demo/Demonstracao.pdf e slides
- CHANGELOG.md