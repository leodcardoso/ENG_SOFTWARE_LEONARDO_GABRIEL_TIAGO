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
| Desenvolvedor Frontend (Habitos e Coringas) | Implementar as telas de habitos e desafios contendo lugares para exibição de informações de coringas e usos através da API do banco de dados. Criar e testar a visualização e alterações no número de coringas.|
| Desenvolvedor Backend (Auth & QA) | Implementar o módulo de Autenticação (Login/Cadastro) seguindo TDD. Definir, codificar e executar os cenários de teste automatizados para a API. Validar os relatórios de teste. |

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

| Papel (Título) | Nome (Recurso Alocado) |
| :--- | :--- |
| Desenvolvedor Frontend & Backend (Notificações) | Gabriel |
| Desenvolvedor Frontend (Habitos e Coringas) | Leonardo |
| Desenvolvedor Backend (Auth & QA) | Tiago |

# Apêndice C

# Testes Gabriel

## Apêndice C: Cenários de Testes Gabriel

Este documento detalha os cenários de teste para o projeto, com foco no módulo de **Notificações** do `Backend`.

### C.1 Funcionalidades

A funcionalidade a ser testada é o **Sistema de Notificações**.

#### C.1.1 Necessidade 1: Gerenciamento de Notificações
* **Como um** usuário autenticado
* **Eu quero** receber e gerenciar notificações do sistema
* **De modo que** eu possa acompanhar convites de amigos, desafios e atualizações de hábitos.

### C.2 Cenários Funcionais

#### C.2.1 Cenário 1: Listar Notificações do Usuário (Caminho Feliz)

* **Descrição do Cenário:** Este teste verifica se um usuário autenticado pode listar suas notificações.
* **Dado que:** Um usuário está autenticado com ID `1` e possui notificações no banco de dados.
* **Quando:** O sistema recebe uma requisição `GET` no endpoint **`/user/notifications`** com um token JWT válido.
* **Então:** O sistema deve retornar um status **200 (OK)** e uma lista de notificações ordenadas por data de criação (mais recentes primeiro), incluindo informações do ator (nome e avatar).

#### C.2.2 Cenário 2: Marcar Notificação como Lida

* **Descrição do Cenário:** Este teste verifica se um usuário pode marcar uma notificação específica como lida.
* **Dado que:** Um usuário autenticado possui uma notificação não lida com ID `5`.
* **Quando:** O sistema recebe uma requisição `PUT` no endpoint **`/user/notifications/5/read`** com um token JWT válido.
* **Então:** O sistema deve retornar um status **200 (OK)**, atualizar o campo `read_at` da notificação com a data/hora atual e retornar a notificação atualizada.

#### C.2.3 Cenário 3: Criar Notificação de Convite de Amizade

* **Descrição do Cenário:** Este teste verifica se o sistema cria uma notificação quando um usuário envia um convite de amizade.
* **Dado que:** O usuário com ID `1` envia um convite de amizade (ID `10`) para o usuário com ID `2`.
* **Quando:** O sistema executa o método `Notification.create()` com os parâmetros: `recipientUserId: 2`, `actorUserId: 1`, `type: 'friend_invite'`, `friendInviteId: 10`.
* **Então:** O sistema deve inserir um novo registro na tabela `notifications` e retornar a notificação criada com todos os campos preenchidos corretamente.

#### C.2.4 Cenário 4: Criar Notificação de Convite de Desafio

* **Descrição do Cenário:** Este teste verifica se o sistema cria uma notificação quando um usuário convida outro para um desafio.
* **Dado que:** O usuário com ID `1` convida o usuário com ID `3` para um desafio (challenge_invite_id: `20`, challenge_id: `15`).
* **Quando:** O sistema executa o método `Notification.create()` com os parâmetros: `recipientUserId: 3`, `actorUserId: 1`, `type: 'challenge_invite'`, `challengeInviteId: 20`, `challengeId: 15`.
* **Então:** O sistema deve criar a notificação e retornar o registro com `challenge_invite_id` e `challenge_id` preenchidos.

#### C.2.5 Cenário 5: Marcar Notificação como Lida - Notificação Inexistente

* **Descrição do Cenário:** Este teste verifica a resposta do sistema ao tentar marcar uma notificação inexistente como lida.
* **Dado que:** O usuário autenticado tenta marcar uma notificação com ID `999` que não existe ou não pertence a ele.
* **Quando:** O sistema recebe uma requisição `PUT` no endpoint **`/user/notifications/999/read`** com um token JWT válido.
* **Então:** O sistema deve retornar um status **404 (Não Encontrado)** e uma mensagem de erro apropriada.

#### C.2.6 Cenário 6: Listar Notificações sem Autenticação

* **Descrição do Cenário:** Este teste verifica se o sistema bloqueia o acesso às notificações sem autenticação.
* **Dado que:** Nenhum token de autenticação é fornecido.
* **Quando:** O sistema recebe uma requisição `GET` no endpoint **`/user/notifications`** sem o header `Authorization`.
* **Então:** O sistema deve retornar um status **401 (Não Autorizado)** e uma mensagem de erro indicando falta de autenticação.

#### C.2.7 Cenário 7: Marcar Notificação como Lida por Convite de Amizade

* **Descrição do Cenário:** Este teste verifica se notificações relacionadas a um convite de amizade podem ser marcadas como lidas automaticamente.
* **Dado que:** Existe uma notificação não lida com `friend_invite_id: 10` para o usuário com ID `2`.
* **Quando:** O sistema executa o método `Notification.markAsReadByFriendInvite(10, 2)`.
* **Então:** O sistema deve atualizar o campo `read_at` da notificação e retornar o registro atualizado.

#### C.2.8 Cenário 8: Marcar Notificação como Lida por Convite de Desafio

* **Descrição do Cenário:** Este teste verifica se notificações relacionadas a um convite de desafio podem ser marcadas como lidas automaticamente.
* **Dado que:** Existe uma notificação não lida com `challenge_invite_id: 20` para o usuário com ID `3`.
* **Quando:** O sistema executa o método `Notification.markAsReadByChallengeInvite(20, 3)`.
* **Então:** O sistema deve atualizar o campo `read_at` da notificação e retornar o registro atualizado.

---
# Testes Leonardo

# Apêndice C: Cenários de Teste – Leonardo

Este documento descreve os cenários de teste referentes ao **Backend** do projeto, com foco na funcionalidade de **Utilização dos Coringas**.



## C.1 Funcionalidades

A funcionalidade a ser validada é o **uso dos Coringas**, que permite ao usuário manter sua sequência de dias (streak) mesmo quando não realiza uma atividade.



### C.1.1 Necessidade 2: Uso de Coringas

**Como** um usuário,  
**Eu quero** utilizar meus coringas,  
**De modo que** eu possa manter minha sequência diária de hábitos (streak).


## C.2 Cenários Funcionais



### C.2.1 Cenário 1: Uso de Coringa com Sucesso (Caminho Feliz)

**Descrição do Cenário:**  
Verifica se o sistema permite o uso de um coringa quando o usuário possui quantidade suficiente.

**Dado que:** o usuário possui coringas disponíveis.  
**Quando:** o sistema recebe uma requisição `POST` para o endpoint `/habits/:habitId/checkin`, contendo o token de autenticação do usuário e o hábito em que o coringa será utilizado.  
**Então:** o sistema deve responder com **status 200 (OK)** e **reduzir a quantidade de coringas** do usuário.



### C.2.2 Cenário 2: Quantidade Insuficiente de Coringas

**Descrição do Cenário:**  
Verifica a resposta do sistema quando o usuário tenta usar um coringa sem possuir quantidade suficiente.

**Dado que:** o usuário não possui coringas disponíveis.  
**Quando:** o sistema recebe uma requisição `POST` para o endpoint `/habits/:habitId/checkin`, contendo o token de autenticação do usuário e o hábito em que o coringa seria utilizado.  
**Então:** o sistema deve responder com **status 401 (Não Autorizado)** e retornar uma **mensagem de erro informando que o usuário não possui coringas**.



### C.2.3 Cenário 3: Aumento do Número de Coringas

**Descrição do Cenário:**  
Verifica se o número de coringas do usuário é incrementado automaticamente no primeiro login do dia.

**Dado que:** o usuário realiza o primeiro login do dia no aplicativo.  
**Quando:** o sistema recebe uma requisição `POST` para o endpoint `/auth/login`, com o corpo:  
```json
{
  "email": "login@teste.com",
  "senha": "qualquer"
}
```  
**Então:** o sistema deve **verificar se é o primeiro login do dia** e, caso seja, **aumentar a quantidade de coringas** do usuário.

---
# Testes Tiago

## Apêndice C: Cenários de Testes Tiago

Este documento detalha os cenários de teste para o projeto, com foco no `Backend`.

### C.1 Funcionalidades

A funcionalidade a ser testada é a **Autenticação de Usuário**.

#### C.1.1 Necessidade 1: Autenticação Segura
* **Como um** usuário
* **Eu quero** fazer login de forma segura no sistema
* **De modo que** eu possa acessar o meu perfil.

### C.2 Cenários Funcionais

#### C.2.1 Cenário 1: Login com Sucesso (Caminho Feliz)

* **Descrição do Cenário:** Este teste verifica se um usuário existente com credenciais corretas pode se autenticar com sucesso.
* **Dado que:** Um usuário existe no banco de dados com o email `usuario@teste.com` e a senha `senha1a23`.
* **Quando:** O sistema recebe uma requisição `POST` no endpoint **`/auth/login`** com o corpo `{"email": "usuario@teste.com", "senha": "senha123"}`.
* **Então:** O sistema deve retornar um status **200 (OK)** e um **token de autenticação** (JWT).

#### C.2.2 Cenário 2: Login com Senha Inválida

* **Descrição do Cenário:** Este teste verifica a resposta do sistema a uma tentativa de login com a senha errada.
* **Dado que:** Um usuário existe no banco de dados com o email `usuario@teste.com`.
* **Quando:** O sistema recebe uma requisição `POST` no endpoint **`/auth/login`** com o corpo `{"email": "usuario@teste.com", "senha": "senha-errada"}`.
* **Então:** O sistema deve retornar um status **401 (Não Autorizado)** e uma mensagem de erro apropriada.

#### C.2.3 Cenário 3: Login com Email Inexistente

* **Descrição do Cenário:** Este teste verifica a resposta do sistema a uma tentativa de login com um email não cadastrado.
* **Dado que:** O email `naoexiste@teste.com` não está cadastrado no banco de dados.
* **Quando:** O sistema recebe uma requisição `POST` no endpoint **`/auth/login`** com o corpo `{"email": "naoexiste@teste.com", "senha": "qualquer"}`.
* **Então:** O sistema deve retornar um status **401 (Não Autorizado)** ou **404 (Não Encontrado)** e uma mensagem de erro apropriada.
