# Apêndice B: Plano de Testes

Este documento descreve o plano de testes para o projeto de **plataforma de construção de hábitos gamificada**, com base no template do manual FreeTest (link: [https://viniciuspessoni.com/wp-content/uploads/2019/09/manual-Freetest-processo-teste-micro-pequenas-empresas.pdf](https://viniciuspessoni.com/wp-content/uploads/2019/09/manual-Freetest-processo-teste-micro-pequenas-empresas.pdf)).

## B.1 Visão Geral do Projeto

O software a ser testado é uma plataforma web que visa combater a dificuldade em manter o foco e a disciplina na construção de hábitos. O projeto utiliza **gamificação** (sistemas de pontos, níveis e recompensas) e **interação social** como ferramentas principais de engajamento, transformando o acompanhamento de metas em uma experiência lúdica e colaborativa.

O propósito desta fase de testes é validar a funcionalidade, confiabilidade e a eficácia dos mecanismos de engajamento da aplicação, começando pela autenticação (TDD) e seguindo para o sistema de gamificação e gerenciamento de hábitos.

### B.1.1 Papéis e Responsabilidades

A Tabela B.1 descreve os papéis e responsabilidades dos membros da equipe no projeto, que tem duração estimada de **um semestre**.

**Tabela B.1: Papéis e Responsabilidades do Projeto**

| Papel (Título) | Responsabilidade |
| :--- | :--- |
| Desenvolvedor Frontend & Backend (Notificações) | Implementar o módulo de Notificações (criação, listagem e marcação como lida). Desenvolver a interface de usuário para exibição de notificações. Definir e executar cenários de teste para o sistema de notificações. |
| Desenvolvedor Frontend (Lista de Amigos) |Implementar as telas de gerenciamento de amigos, integradas à API do backend. Criar e testar o envio, recebimento e aceitação de solicitações de amizade, incluindo validações de usuário inexistente e solicitações duplicadas.
| Desenvolvedor Backend (Auth & Core) | Responsável pelo TDD e implementação do Backend para duas áreas críticas: Autenticação (Login/Segurança) e Regras de negócio da Criação de Hábitos (Validações e Persistência). |

## B.2 Equipe e Infra-estrutura

Detalha a equipe e a infra-estrutura técnica definida na análise de viabilidade do projeto.

* **Infra-estrutura:**
    * **Banco de dados:** PostgreSQL para armazenar usuários, hábitos, progresso, notificações, desafios e relações de amizade.
    * **Backend:** Node.js com Express.js para criação da API RESTful.
    * **Linguagem:** JavaScript (Node.js no backend, JavaScript/HTML/CSS no frontend).
    * **Autenticação:** JWT (JSON Web Tokens) para gerenciamento de sessões.
    * **Comunicação:** Protocolos HTTP/HTTPS (para comunicação cliente/servidor).
    * **Hardware:** Disponível na universidade.
    * **Gerenciamento de Atividades:** Trello.
    * **Versionamento de Código:** GitHub.

### B.2.1 Planejamento da Alocação de Pessoal

A Tabela B.2 expõe as informações da equipe de **3 pessoas** alocada para o teste do sistema, mapeando os papéis definidos na Seção B.1.1 para os membros da equipe.

**Tabela B.2: Alocação de Pessoal**

| Papel (Título) | Nome (Recurso Alocado) | Módulo de teste(TDD)|
| :--- | :--- | :--- |
| Desenvolvedor Frontend & Backend (Notificações) | Gabriel | Sistema de Notificações |
| Desenvolvedor Frontend (Habitos e Coringas) | Leonardo | Gerenciamento de Amizade |
| Desenvolvedor Backend (Auth & Core) | Tiago | Autenticação e Criação de Hábitos |
