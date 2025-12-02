# Apêndice C: Cenários de Teste -- Manutenção da lista de amigos

Este documento descreve os cenários de teste referentes ao **Backend** e visualizações no **FrontEnd** do projeto, com foco na funcionalidade de **Alterar Lista de Amigos**.

## C.1 Funcionalidades

A funcionalidade a ser validada é a **manutenção da lista de amigos**, que permite ao
usuário enviar e aceitar solicitações de amizade, alem de visualizar os seus amigos.

### C.1.1 Necessidade 1: Enviar Solicitação de Amizade

**Como** um usuário,\
**Eu quero** enviar solicitações de amizade,\
**De modo que** eu possa me conectar com outros usuários na plataforma.

## C.2 Cenários Funcionais

### C.2.1 Cenário 1: Enviar Solicitação com Sucesso (Caminho Feliz)

**Descrição do Cenário:**\
Verifica se o sistema permite enviar uma solicitação de amizade para um
usuário existente.

**Dado que:** o usuário autenticado deseja adicionar outro usuário
existente.\
**Quando:** o sistema recebe uma requisição POST para
`/friends/request`, contendo:

``` json
{
  "friendId": "12345"
}
```

e o token válido do usuário.\
**Então:** o sistema deve responder com **status 200 (OK)** e registrar
a solicitação de amizade.

------------------------------------------------------------------------

### C.2.2 Cenário 2: Usuário Destino Não Existe

**Descrição do Cenário:**\
Verifica a resposta quando a solicitação é enviada para um usuário
inexistente.

**Dado que:** o usuário autenticado tenta adicionar um usuário
inexistente.\
**Quando:** o sistema recebe uma requisição POST para `/friends/request`
com um `friendId` inválido.\
**Então:** o sistema deve responder com **status 404 (Não Encontrado)**
e retornar uma mensagem indicando que o usuário alvo não foi encontrado.

------------------------------------------------------------------------

### C.2.3 Cenário 3: Solicitação Já Enviada

**Descrição do Cenário:**\
Verifica o comportamento do sistema quando o usuário já enviou uma
solicitação pendente.

**Dado que:** já existe uma solicitação pendente entre os dois
usuários.\
**Quando:** o sistema recebe uma nova requisição POST para
`/friends/request`.\
**Então:** o sistema deve responder com **status 409 (Conflito)**
informando que já existe uma solicitação pendente.

------------------------------------------------------------------------
### C.2.4 Cenário 4: Usuário Já é Amigo

**Descrição do Cenário:**\
Verifica o retorno quando o usuário tenta enviar solicitação para alguém
que já é seu amigo.

**Dado que:** os usuários já constam como amigos na base.\
**Quando:** o sistema recebe uma requisição POST para
`/friends/request`.\
**Então:** o sistema deve responder com **status 400 (Requisição
Inválida)** e informar que os usuários já são amigos.


## Apêndice C: Cenários de Testes Funcionais

Abaixo estão os cenários de validação para as funcionalidades críticas do sistema, documentando o comportamento esperado.

### 1. Funcionalidade: Autenticação
**Cenário:** Login com Sucesso
- **Dado que** existe um usuário cadastrado com email `joao.silva@email.com` e senha válida no banco de dados.
- **Quando** o usuário envia uma requisição `POST` para `/api/auth/login` com essas credenciais corretas.
- **Então** o sistema deve retornar status **200 (OK)** e um objeto contendo um **Token JWT** válido para acesso às rotas protegidas.

### 2. Funcionalidade: Gestão de Hábitos
**Cenário:** Criação de Hábito com Validação
- **Dado que** o usuário está autenticado com um Token JWT válido.
- **Quando** envia um `POST` para `/api/habits` com Título, Descrição e Categoria preenchidos corretamente.
- **Então** o sistema deve persistir o hábito associado ao ID do usuário no banco e retornar status **201 (Created)** com os dados do registro criado.

---

## Apêndice D: Relatório de Cobertura de Testes

Tabela consolidada das funcionalidades verificadas e seus respectivos módulos no Backend.

| Funcionalidade | Arquivos Analisados | Demandas Cobertas |
| :--- | :--- | :--- |
| **Gerenciamento de amigos** | `FrontEnd/components/views/Friends/FriendsScreen.tsx`|  Visualização de respostas adequadas para os testes citados acima |
