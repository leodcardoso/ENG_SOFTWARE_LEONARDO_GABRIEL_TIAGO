# Plano de Gestão da Qualidade

Este documento descreve os processos e padrões adotados pela equipe para garantir a qualidade do software, desde a concepção até a entrega.

## 1. Papéis e Responsabilidades

* **Arquiteto (Responsabilidade Coletiva):**
    * As decisões de arquitetura e a escolha de Padrões de Projeto são definidas em reuniões coletivas com toda a equipe.
    * As decisões são documentadas nos arquivos de arquitetura (ex: `Decisoes_de_Padroes.md`).

* **QA - Controle de Qualidade (Revisão Cruzada):**
    * O papel de QA é exercido pelo revisor de um Pull Request (PR).
    * Adotamos a **revisão cruzada** (ex: Gabriel revisa o código de Leonardo, Tiago revisa o de Gabriel, etc.).
    * **Objetivo:** Garantir que todos os membros da equipe tenham uma visão mínima de todas as partes do projeto, facilitando a manutenção e o compartilhamento de conhecimento.

* **Desenvolvedor (Dev):**
    * Implementar as funcionalidades conforme definido nos documentos de conceito.
    * Manter a organização da estrutura de pastas do projeto.
    * Realizar **Testes End-to-End locais** (rodando Front e Back) antes de abrir um PR, para minimizar a introdução de erros.
    * Seguir rigorosamente os padrões de Git e Convenção de Commits.

## 2. Padrões de Desenvolvimento

* **Fluxo de Git (Simplificado):**
    1.  O desenvolvedor cria uma nova `feature-branch` a partir da `main`.
    2.  O trabalho é realizado e "commitado" nessa branch.
    3.  Após a conclusão e os testes locais, o desenvolvedor abre um Pull Request (PR) para a `main`.
    4.  O PR passa pela Revisão Cruzada (QA).
    5.  Após a aprovação, o código é mesclado na `main`.
    * **Regra principal:** Nenhum código é enviado diretamente para a `main`. Todo código deve ser testado localmente e aprovado por um colega para evitar a sobrescrita de código funcional.

* **Convenção de Commits:**
    * Utilizamos o padrão **Conventional Commits** por ser uma prática de mercado amplamente adotada, facilitando a leitura do histórico.
    * Exemplos: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`.

* **Linters e Formatação (Code Style):**
    * O projeto não utiliza ferramentas automatizadas de linting (ESLint) ou formatação (Prettier) no momento.
    * A consistência do estilo de código (indentação, nomes de variáveis) é validada visualmente durante o processo de Code Review (Revisão Cruzada).

## 3. Padrões de Documentação

* **Checklist de Pull Request (PR):**
    * Não utilizamos um template automatizado de PR. O processo de revisão é manual e baseado na comunicação da equipe.
    * O autor do PR é responsável por garantir e comunicar os seguintes pontos ao revisor:
        1.  **Teste Local Realizado:** Confirmar que a funcionalidade foi testada de ponta a ponta (UI + API).
        2.  **Documentação Atualizada:** (Se aplicável) Informar se alguma alteração foi feita nos documentos de conceito.
        3.  **Aviso à Equipe:** Notificar os colegas no canal de comunicação (ex: WhatsApp/Discord) sobre o PR aberto e, posteriormente, sobre o merge.

* **Documentação de Requisitos:**
    * Ss requisitos, conceitos e o design da aplicação são mantidos em "documentos vivos" na pasta `/docs`.
    * Exemplos: `conseitoRotas.md`, `conseitoFunções.md`, `ConseitoDB.md`.
    * **[Conceito de Rotas](../conseitoRotas.md)**
    * **[Conceito de Funções](../conseitoFunções.md)**
    * **[Conceito de DB](../db/conseitoDB.md)**
    * **[DB](../db/db.md)**

    * Funcionalidades planejadas para versões futuras (mas ainda não implementadas) são documentadas nesses arquivos e marcadas com texto riscado (ex: `~~Porcentagem~~`).

## 4. Padrões Não Funcionais (NFRs)

* **Performance:**
    * O tempo de resposta para requisições da API (Backend) deve ser, em média, **inferior a 500ms** (sem considerar a latência da rede).

* **Segurança:**
    * **Senhas:** Armazenamento no banco de dados utiliza `bcrypt` para hashing.
    * **Segredos:** Nenhuma chave de API ou senha de banco é "commitada". Todas são gerenciadas através de arquivos `.env`.
    * **Autenticação:** O sistema utiliza Tokens JWT (JSON Web Tokens) para autenticação de sessão, validados no cliente (usando `jwt-decode`) e no servidor.

* **Tratamento de Erros (API):**
    * A API utiliza códigos de status HTTP para comunicar o resultado das operações.
    * **Códigos Utilizados:**
        * `200 OK` / `201 Created`: Sucesso.
        * `400 Bad Request`: Erro de validação (ex: e-mail faltando, senha curta).
        * `401 Unauthorized`: Token de acesso ausente ou inválido.
        * `404 Not Found`: Recurso (ex: usuário ou hábito) não encontrado.
        * `500 Internal Server Error`: Falha crítica no servidor (ex: banco de dados offline).

* **Logs:**
    * **Ambiente de Desenvolvimento (Local):** Todas as requisições HTTP recebidas pela API (método, rota e status) são logadas no console para facilitar o debug.
    * **Ambiente de Produção (Teórico):** Apenas erros críticos (Status 5xx) seriam registrados, para monitorar a saúde do servidor sem gerar "ruído" excessivo.

## 5. Processo de QA (Controle de Qualidade)

* **Cobertura e Tipo de Testes:**
    * A meta de cobertura de **30%** aplica-se a ambos (Front e Back) e refere-se à **cobertura de funcionalidades** validada por testes manuais (não testes de unidade automatizados).
    * **Backend:** Testado manualmente via **Postman** (Testes de API / Integração).
    * **Frontend:** Testado manualmente na própria **Interface do Usuário (UI)** (Testes End-to-End).

* **Critérios de Aceite:**
    * Os critérios de aceite para uma funcionalidade (o que ela deve fazer) são definidos nos documentos de conceito (ex: `conseitoRotas.md`, `conseitoFunções.md`).

* **Gestão de Bugs:**
    * Bugs que impedem o funcionamento essencial da aplicação são tratados com **prioridade imediata**.
    * Bugs não-críticos (ex: de layout, texto incorreto) são registrados e priorizados para o próximo ciclo de desenvolvimento (sprint).