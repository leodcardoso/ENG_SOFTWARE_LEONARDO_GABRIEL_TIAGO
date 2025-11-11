# Planejamento Geral da Revisão

**Objetivo da revisão:** Garantir que os requisitos estão claros, completos e testáveis.

**Participantes:** Todos os membros da equipe.

**Método:** Revisão por inspeção (cada membro lê a HU e os critérios de aceitação, apontando inconsistências, ambiguidades ou lacunas).

## Itens a Revisar:

- A HU está compreensível?
- Os critérios de aceitação estão claros e suficientes?
- Há omissões que impediriam a implementação?
- Os critérios são testáveis?

---

## Documentação HU1 - Gabriel

| Item Revisado            | Observação                                                 | Ação Sugerida                                         |
| ------------------------ | ---------------------------------------------------------- | ----------------------------------------------------- |
| Horário determinado      | Não especifica qual horário                               | Definir horário específico ou permitir configuração   |
| Quem perdeu o streak     | Critério questionável para motivação                      | Reavaliar se é necessário mostrar quem perdeu        |
| Notificação deve incluir informações | Critérios para definir se uma informação é válida | Definir quais são as informações                      |

## Documentação HU2 - Gabriel

| Item Revisado       | Observação                                                      | Ação Sugerida                                    |
| ------------------- | --------------------------------------------------------------- | ------------------------------------------------ |
| Filtros             | Falta especificar tipos de filtro possíveis                    | Listar opções de filtro disponíveis             |
| Objetivos           | Especificar quantos objetivos e streaks por vez irão aparecer  | Definir número máximo para evitar poluição      |

## Documentação HU3 - Gabriel

| Item Revisado         | Observação                                           | Ação Sugerida                                        |
| --------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| Mudança de cor        | Não especifica cores ou estado visual               | Definir cores específicas e estados do botão        |
| "Todos os membros"    | Não define comportamento se grupo estiver vazio     | Retirar se for objetivo privado ou sem ninguém no grupo  |
| Informações da atividade | Não especifica quais informações incluir         | Listar dados que devem constar na notificação       |

---

## Documentação HU1 - Leonardo
| Item revisado         | Observação                                                       | Ação sugerida                                      |
| --------------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
| HU compreensível      | A frase “manter constância” é vaga                               | Especificar “manter constância de hábitos diários” |
| Notificações          | Sem horário definido                                             | Adicionar configuração de horário                  |
| Hábitos já realizados | Não define o que ocorre se usuário já completou todos os hábitos | Especificar mensagem “Todos hábitos concluídos”    |

## Documentação HU2 - Leonardo
| Item revisado          | Observação                  | Ação sugerida                                                 |
| ---------------------- | --------------------------- | ------------------------------------------------------------- |
| Atualização do ranking | Não especifica frequência   | Definir “ranking atualizado a cada ação que altera pontuação” |
| Ordem do ranking       | Não está clara              | Ordenar do maior para o menor                                 |
| Amigos                 | Adição/remover não descrito | Especificar fluxo de adição/remover amigos                    |

## Documentação HU3 - Leonardo
| Item revisado  | Observação                              | Ação sugerida                         |
| -------------- | --------------------------------------- | ------------------------------------- |
| Uso do coringa | Não especifica ação se hábito concluído | Bloquear uso e exibir aviso           |
| Cooldown       | Falta tempo definido                    | Definir 24h entre usos                |
| Notificação    | Não descrita                            | Notificar usuário após uso do coringa |

---

### Documentação HU1 - Tiago
| Item Revisado | Observação | Ação Sugerida |
| :--- | :--- | :--- |
| Criador do Desafio| Não está definido o que acontece se o criador do desafio sair do grupo ou excluir a conta. | Definir regra de negócio: ou o desafio é encerrado, ou a "propriedade" do desafio é transferida para o próximo participante mais antigo. |
| Atualização do Progresso| Não está claro  como o progresso de um desafio é atualizado. | Especificar que o progresso será atualizado assim que um usuário registrar uma atividade. |

### Documentação HU2 - Tiagos
| Item Revisado | Observação | Ação Sugerida |
| :--- | :--- | :--- |
| Privatização na Criação| O requisito de criar um hábito já como privado não estava explícito. | Adicionar um controle (checkbox/switch) na tela de **criação** do hábito para que ele já possa nascer privado. |
| Ícone de Privacidade| O critério menciona o ícone na lista pessoal, mas não em outras telas onde o hábito possa aparecer para o dono. | Clarificar que o indicador de privacidade (cadeado) deve estar visível para o dono em **todas** as interfaces onde o hábito for exibido. |

### Documentação HU3 - Tiago
| Item Revisado | Observação | Ação Sugerida |
| :--- | :--- | :--- |
| Ação de "Concluir" | A ação de marcar um hábito como concluído parece ser permanente, sem uma forma de reverter um erro. | Adicionar um requisito para uma funcionalidade de **"Reativar Hábito"** a partir da tela de troféus, movendo-o de volta para a lista ativa. |
| Notificação de conclução | Quando concluir uma ação for concluida notificar os amigos | Adicionar uma mecanismo para notificar |
