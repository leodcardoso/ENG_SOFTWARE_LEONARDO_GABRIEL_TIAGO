### História 1: Desafios em Grupo

* **Como** usuário, **eu quero** criar desafios em grupo, **para** poder competir ou colaborar com meus amigos.

#### Critérios de Aceitação
* Deve existir um botão para "Criar Desafio" onde posso convidar amigos.

---

### História 2: Hábitos Privados

* **Como** usuário, **eu quero** deixar alguns hábitos privados, **para que** meus amigos não vejam tudo o que eu estou fazendo.

#### Critérios de Aceitação
* Na tela de criação ou edição do hábito, deve haver uma opção para "Tornar Privado".
* Um hábito privado não pode aparecer no feed de atividades dos amigos.

---

### História 3: Troféus por Conquista

* **Como** usuário, **eu quero** marcar um hábito como "concluído", **para que** ele saia da minha lista diária e vire um troféu.

#### Critérios de Aceitação
* Todo hábito deve ter uma opção para ser marcado como "Concluído".

---
### Diagrama de Sequência

![Diagrama HUE Tiago3](../Diagramas/Diagrama_HU_Tiago.svg)

### **História de Usuário 1: O Ciclo de Recompensa e Consistência (Streak)**

* **Como** um usuário tentando ser consistente, **eu quero** ganhar pontos e manter uma sequência de dias ("streak") por cada hábito completado, **para** visualizar meu progresso e me sentir recompensado pelo meu esforço diário.

#### Embasamento Teórico:
* [cite_start]**Fundamentação Conceitual (MEROTO):** O uso de "sistemas de pontuação e recompensas" visa motivar os usuários, reconhecer seu progresso e esforço[cite: 119]. [cite_start]O artigo destaca que esses sistemas são uma das características mais comuns da gamificação [cite: 196][cite_start], promovendo um senso de progresso e realização[cite: 197].
* **Fatores Humanos (RESTREPO-TAMAYO et al.):** O estudo sobre a relação entre elementos de gamificação e fatores humanos valida que o uso de recompensas e o acompanhamento de progresso (como a "streak") são fatores importantes para o engajamento do usuário.

#### Critérios de Aceitação:
* Ao completar um hábito, o usuário deve receber uma quantidade pré-definida de pontos.
* Deve haver um contador de "streak" visível para cada hábito, que incrementa em +1 a cada dia consecutivo de conclusão.
* Se o usuário falhar em completar o hábito por um dia, a "streak" deve ser resetada para 0.

---

### **História de Usuário 2: O Incentivo Social (Ranking)**

* **Como** um usuário motivado por competição, **eu quero** ver um ranking semanal com a pontuação dos meus amigos, **para que** a competição amigável me incentive a acumular mais pontos e a não ficar para trás.

#### Embasamento Teórico:
* **Validação Experimental (GERSHON et al.):** O experimento de campo "Friends with Health Benefits" fornece uma forte evidência de que os incentivos sociais (amigos) têm um impacto direto e positivo na manutenção de hábitos saudáveis, justificando plenamente a criação de um ranking.
* **Fatores Sociais (RESTREPO-TAMAYO et al.):** A pesquisa conecta diretamente os elementos de gamificação (como pontos e rankings) aos fatores sociais, demonstrando que a competição é um motivador social relevante.
* [cite_start]**Fundamentação Conceitual (MEROTO):** A aplicação de "sistemas de classificação" [cite: 127] [cite_start]e "placares" [cite: 196] [cite_start]é uma mecânica de jogo clássica utilizada para promover experiências que envolvem os usuários e incentivam a interação[cite: 128].

---

### **História de Usuário 3: O Controle Pessoal (Autonomia)**

* **Como** um usuário com objetivos únicos, **eu quero** poder definir meus próprios hábitos customizados e escolher se quero compartilhá-los ou mantê-los privados, **para que** o aplicativo se adapte à minha vida e eu me sinta no controle do meu processo.

#### Embasamento Teórico:
* **Fatores Humanos e Sociais (RESTREPO-TAMAYO et al.; GERSHON et al.):** Para que os usuários se sintam confortáveis em um ambiente social e gamificado, é crucial que eles tenham controle sobre sua participação. A opção de privacidade respeita o "fator humano" da individualidade, permitindo que o usuário se engaje nas funcionalidades sociais (descritas por Gershon et al.) em seus próprios termos.
* [cite_start]**Contexto (MEROTO):** O artigo reforça essa necessidade ao afirmar que os jogos costumam oferecer uma "sensação de autonomia" [cite: 184] [cite_start]e que a gamificação pode atender à necessidade psicológica básica de "autonomia"[cite: 194]. [cite_start]O texto também ressalta que a "personalização da experiência de gamificação é outro aspecto crítico" [cite: 289] para o sucesso da abordagem.

#### Critérios de Aceitação:
* Deve haver um botão "Criar Novo Hábito" que abre um formulário.
* No formulário de criação/edição de hábito, deve haver uma opção (checkbox) "Tornar Privado".
* Se um hábito for privado, ele não deve aparecer no feed de atividades dos amigos.
