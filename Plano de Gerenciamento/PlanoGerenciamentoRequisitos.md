# Plano de Gerenciamento de Requisitos

Este documento define os processos, ferramentas e responsabilidades relacionadas ao gerenciamento de requisitos do projeto de software de gamificação para desenvolvimento de hábitos.

## 1. Processos de Requisitos

### 1.1 Elicitação de Requisitos

**Técnicas utilizadas:**
- **Entrevistas estruturadas**: Continuaremos usando entrevistas com usuários potenciais, seguindo um roteiro padronizado.
- **Prototipação**: Usaremos protótipos para validar conceitos e obter feedback.
- **Análise de aplicativos similares**: Benchmark contínuo com aplicativos de gamificação e formação de hábitos.

**Cadência:**
- Sessões de elicitação a cada 2 semanas durante o ciclo de desenvolvimento inicial

**Documentação:**
- Todas as entrevistas serão gravadas (com consentimento) e transcritas

### 1.2 Análise de Requisitos

**Processo:**

1. **Avaliação de qualidade**: Cada requisito será avaliado quanto a:
   - Clareza
   - Testabilidade
   - Viabilidade técnica
   - Consistência com outros requisitos

2. **Refinamento**: Os requisitos imprecisos serão refinados em reuniões semanais de revisão.

### 1.3 Validação de Requisitos

**Técnicas:**
- **Revisões por pares**: Cada requisito será revisado por pelo menos dois membros da equipe.
- **Prototipação**: Protótipos interativos serão usados para validar requisitos.

**Critérios de aceitação:**
- Todo requisito deve ter pelo menos 1 critérios de aceitação específicos e testáveis

### 1.4 Priorização de Requisitos

**Critérios de priorização:**
- Valor para o usuário (baseado em feedback)
- Complexidade técnica
- Dependências com outros requisitos
- Alinhamento estratégico com objetivos do produto

## 2. Controle de Mudanças e Versionamento

### 2.1 Processo de Controle de Mudanças

1. **Solicitação de mudança**:
   - Qualquer stakeholder pode solicitar mudanças
   - A  mudança deve ter justificativa e impacto estimado

2. **Avaliação**:
   - Impacto no escopo, cronograma e recursos
   - Priorização relativa a requisitos existentes
   - Análise técnica preliminar

3. **Aprovação**:
   - Mudanças de baixo impacto: aprovação pelo responsável de implementar
   - Mudanças de médio impacto: aprovação pelo comitê de mudanças (reunião semanal)
   - Mudanças de alto impacto: aprovação por todos os stakeholders

4. **Implementação e comunicação**:
   - Atualização da documentação
   - Notificação para todas as partes afetadas
   - Registro no histórico de mudanças

### 2.2 Versionamento

**Documentos de requisitos**:
- Nomenclatura: `[Nome do documento]_v[X.Y].md`
  - X: versões principais com mudanças significativas
  - Y: revisões menores e correções

**Controle de versão no GitHub**:
- Cada versão oficial será marcada
- Branches separados para desenvolvimento de novas funcionalidades
- Pull requests obrigatórios com pelo menos uma aprovação

**Rastreabilidade**:
- Cada requisito terá um ID único: `[Tipo][Número]` (exemplo: F001, NF003)
- Matriz de rastreabilidade relacionando requisitos com:
  - Histórias de usuário
  - Casos de teste
  - Componentes de implementação

## 3. Responsabilidades da Equipe

### 3.1 Papéis

**Analista de Requisitos**:
- Liderar entrevistas com usuários
- Redigir histórias de usuário e requisitos funcionais
- Manter a matriz de rastreabilidade atualizada

**Líder Técnico**:
- Avaliar viabilidade técnica dos requisitos
- Validar requisitos não-funcionais
- Aprovar mudanças de baixo impacto

**Gerente de Produto**:
- Priorizar requisitos usando o método MoSCoW
- Coordenar o comitê de mudanças
- Garantir alinhamento com a visão do produto

### 3.2 Comunicação

**Reuniões**:
- **Refinamento de Backlog**: Semanal (1 hora)
- **Comitê de Mudanças**: Semanal (30 minutos)
- **Revisão de Requisitos**: Quinzenal (2 horas)

**Ferramentas**:
- **Documentação**: GitHub + Markdown
- **Gerenciamento de Tarefas**: Trello
- **Comunicação**: Grupo no WhatsApp para comunicações rápidas

### 3.3 Métricas e Qualidade

**Métricas de requisitos**:
- Percentual de requisitos aprovados na primeira revisão
- Tempo médio de aprovação de mudanças
- Número de requisitos por versão

**Garantia de qualidade**:
- Auditorias mensais de documentação
- Revisões por pares para todas as histórias de usuário

## 4. Ferramentas e Templates

**Ferramentas**:
- **Repositório**: GitHub para versionamento
- **Protótipos**: Figma para design de interface
- **Diagramas**: PlantUML para diagramas de sequência e fluxos

**Templates**:
- Template de história de usuário
- Formulário de solicitação de mudança
- Matriz de rastreabilidade
- Relatório de revisão de requisitos
