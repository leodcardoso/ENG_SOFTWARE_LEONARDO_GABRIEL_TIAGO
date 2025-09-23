# Documento de Requisitos - Versão 2

## Sumário de Mudanças

Este documento representa a segunda versão do Documento de Requisitos, incorporando melhorias baseadas na revisão sistemática realizada. Abaixo estão as principais mudanças e ajustes:

1. **Histórias de Usuário**: Refinamentos de critérios de aceitação com base nas revisões
2. **Requisitos Funcionais**: Adicionados requisitos derivados das revisões
3. **Requisitos Não-Funcionais**: Incluídos com foco em usabilidade e privacidade

## Histórias de Usuário Refinadas

Nesta seção, apresentamos as histórias de usuário atualizadas com os refinamentos baseados nas revisões.

### Histórias de Gabriel (Revisadas)

#### HU1: Notificações de Colocação em Streak

**Como** usuário, **eu quero** que o aplicativo me notifique assim que eu alcançar uma nova colocação num streak, **para** aumentar a minha motivação.

**Critérios de Aceitação Refinados:**
1. O usuário deve receber uma notificação quando alcançar uma nova colocação num streak.
2. A notificação deve indicar a nova colocação alcançada e quem perdeu o streak.
3. **[REFINADO]** As notificações serão enviadas às 22h diariamente, consolidando todas as mudanças do dia.
4. Se uma ou mais colocações forem alteradas, deve-se notificar todas juntas.
5. **[REFINADO]** A notificação deve incluir quais atividades específicas contribuíram para a mudança de posição.

#### HU2: Visualização Integrada de Objetivos e Streaks

**Como** usuário, **eu quero** ver meus objetivos e streaks juntos, **para** ter maior entendimento e visualizar quais objetivos estão ativos.

**Critérios de Aceitação Refinados:**
1. O usuário deve conseguir ver seus objetivos e streaks na mesma tela.
2. Deve conter o nome e pontos dos outros usuários.
3. Deve estar destacado o próprio usuário.
4. O usuário deve conseguir ver quais objetivos estão ativos e quais não estão.
5. **[REFINADO]** A interface deve permitir filtrar por tipo de objetivo (saúde, educação, produtividade).
6. **[NOVO]** A visualização será limitada a mostrar no máximo 5 streaks por vez para evitar poluição visual.

#### HU3: Notificações para Atividades em Grupo

**Como** usuário, **eu quero** ter a possibilidade de enviar uma notificação para que todos os outros usuários do grupo também façam uma atividade no momento, **para** que todos possam se motivar e apoiar uns aos outros.

**Critérios de Aceitação Refinados:**
1. O usuário deve conseguir enviar uma notificação para todos os membros do grupo.
2. **[REFINADO]** A notificação deve incluir o nome do hábito, pontos ganhos e uma mensagem opcional de até 50 caracteres.
3. Deve ser possível apenas uma vez por período da atividade.
4. Só deve ser possível se a pessoa marcar a atividade como concluída.
5. **[REFINADO]** O botão deve mudar de cor de azul para verde quando a notificação for enviada.
6. **[NOVO]** Grupos vazios não terão a opção de envio de notificação disponível.

### Histórias de Leonardo (Revisadas)

#### HU1: Notificações de Hábitos

**Como** estudante, **gostaria** de ser lembrado diariamente dos meus hábitos ativos ainda não completados, **para** manter uma maior constância de hábitos diários.

**Critérios de Aceitação Refinados:**
1. Receber notificações diárias.
2. Hábitos já realizados não devem aparecer na notificação.
3. **[REFINADO]** O usuário poderá configurar o horário da notificação nas configurações do hábito.
4. A notificação deve indicar claramente quais hábitos estão pendentes.
5. Suporte a múltiplos hábitos por dia.
6. **[NOVO]** Se todos os hábitos já estiverem concluídos, exibir mensagem "Todos hábitos concluídos".

#### HU2: Ranking de Amigos

**Como** usuário do aplicativo, **gostaria** de visualizar um ranking com meus amigos, **para** promover um incentivo maior devido à competição.

**Critérios de Aceitação Refinados:**
1. Visualização do ranking das pessoas adicionadas.
2. **[REFINADO]** O ranking será atualizado em tempo real a cada ação que altere a pontuação.
3. Indicação do próprio usuário no ranking.
4. Ordenação do ranking do maior para o menor.
5. **[REFINADO]** Capacidade de adicionar/remover amigos do ranking através de botões dedicados em cada entrada do ranking.

#### HU3: Carta Coringa para Hábitos

**Como** usuário, **gostaria** da existência de um coringa **para** não perder o progresso devido a imprevistos.

**Critérios de Aceitação Refinados:**
1. Coringa limitado (número máximo de usos).
2. **[REFINADO]** O coringa só pode ser usado em hábito não concluído e o botão ficará desabilitado para hábitos já concluídos.
3. **[REFINADO]** O coringa retorna após 24 horas (cooldown).
4. **[REFINADO]** O usuário receberá uma notificação quando usar o coringa e outra quando ele estiver disponível novamente.
5. Registro do uso do coringa para histórico do usuário.

### Histórias de Tiago (Revisadas)

#### HU1: Desafios em Grupo

**Como** usuário, **eu quero** criar desafios em grupo, **para** poder competir ou colaborar com meus amigos.

**Critérios de Aceitação Refinados:**
1. Deve existir um botão visível para "Criar Desafio" na interface principal ou na área social.
2. Ao criar um desafio, o usuário deve poder definir um nome, uma meta clara (ex: "Correr 20 km no total") e uma data de término.
3. O criador do desafio deve poder selecionar amigos de uma lista para enviar os convites.
4. Os amigos convidados podem ver detalhes dos desafios.
5. Deve haver uma tela específica para cada desafio, onde todos os participantes possam visualizar o progresso individual e coletivo em direção à meta.
6. **[NOVO]** Se o criador do desafio sair do grupo, a propriedade será transferida para o participante mais antigo.

#### HU2: Hábitos Privados

**Como** usuário, **eu quero** deixar alguns hábitos privados, **para que** meus amigos não vejam tudo o que eu estou fazendo.

**Critérios de Aceitação Refinados:**
1. **[REFINADO]** Na tela de criação ou edição do hábito, deve haver um switch para marcar o hábito como "Privado".
2. Um hábito privado não deve aparecer no feed de atividades públicas dos amigos ou em qualquer ranking compartilhado.
3. **[REFINADO]** Na lista pessoal de hábitos do usuário, os hábitos privados devem ser identificados com um ícone de cadeado em todas as interfaces onde aparecem.
4. A pontuação e as sequências (streaks) de um hábito privado não devem ser contabilizadas em desafios públicos ou rankings competitivos.
5. O usuário deve poder alterar a privacidade de um hábito (de público para privado e vice-versa) a qualquer momento.

#### HU3: Troféus por Conquista

**Como** usuário, **eu quero** marcar um hábito como "concluído", **para que** ele saia da minha lista diária e vire um troféu.

**Critérios de Aceitação Refinados:**
1. Todo hábito ativo deve ter uma opção acessível para ser marcado como "Concluído".
2. Ao ser marcado como concluído, o hábito deve ser removido da lista de tarefas diárias para não gerar mais notificações.
3. O hábito concluído deve ser movido para uma seção separada chamada "Troféus" ou "Conquistas" no perfil do usuário.
4. Na seção de troféus, o hábito deve exibir um resumo do desempenho, como a maior sequência (streak) alcançada e a data de conclusão.
5. O usuário deve ter a opção de criar uma sequência igual a alguma que já foi concluída.
6. **[NOVO]** Adicionar funcionalidade de "Reativar Hábito" a partir da tela de troféus, movendo-o de volta para a lista ativa.
7. **[NOVO]** Quando um hábito for concluído, enviar notificação para amigos próximos.

## Requisitos Não-Funcionais (Novos)

### Privacidade e Segurança

1. **NFR-P1**: O sistema deve garantir que hábitos marcados como privados não sejam visíveis para outros usuários em nenhuma circunstância.
2. **NFR-P2**: O sistema deve armazenar as senhas dos usuários utilizando algoritmos de hash seguros (bcrypt ou similar).
3. **NFR-P3**: O sistema deve obter consentimento explícito do usuário antes de enviar notificações push.

### Usabilidade

1. **NFR-U1**: O tempo de resposta para ações comuns (marcar hábito como concluído, visualizar ranking) não deve exceder 1 segundo.
2. **NFR-U2**: O aplicativo deve ser utilizável em modo offline, sincronizando os dados quando a conexão for restaurada.
3. **NFR-U3**: O tamanho mínimo de elementos interativos deve ser de 44x44 pixels para garantir usabilidade em dispositivos touchscreen.

### Confiabilidade

1. **NFR-C1**: O sistema deve realizar backups automáticos diários das informações dos usuários.
