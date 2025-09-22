# Embasamento Teórico do Projeto

O desenvolvimento deste software baseia-se em um tripé conceitual validado por pesquisas acadêmicas nas áreas de psicologia, tecnologia e ciências comportamentais. Os artigos de referência fornecem:
1.  O princípio geral da gamificação como ferramenta de engajamento.
2.  A validação prática de sua aplicação em saúde e bem-estar.
3.  O embasamento psicológico que explica por que a abordagem funciona.

---

### 1. O Princípio da Gamificação como Ferramenta de Engajamento (Baseado em Tiago)

O artigo **["A Gamificação como Ferramenta de Engajamento"](https://ojs.focopublicacoes.com.br/foco/article/view/4122/2901)** estabelece a premissa central do nosso projeto: o uso de mecânicas de jogos em contextos não relacionados a jogos para aumentar a motivação e o engajamento. O autor demonstra como elementos como **pontos, missões (desafios) e rankings (leaderboards)** transformam tarefas rotineiras em atividades mais lúdicas e prazerosas.

* **Aplicação no Projeto:** Nosso software adota diretamente esses elementos. O sistema de **pontos e níveis** oferece um feedback imediato e uma sensação de progresso, enquanto as **missões** criam metas claras e alcançáveis. Essa estrutura, conforme aponta o artigo, é fundamental para manter os usuários focados e engajados no processo de construção de hábitos.

---

### 2. A Validação Prática em Aplicativos de Saúde (Baseado em Leonardo)

O artigo **["Effectiveness of a gamified mobile app for promoting physical activity and healthy eating in young adults"](https://pmc.ncbi.nlm.nih.gov/articles/PMC12002541/)** serve como uma validação empírica e direta da nossa proposta. Trata-se de um ensaio clínico randomizado que comprova a eficácia de um aplicativo gamificado — muito similar ao nosso — para promover hábitos saudáveis.

* **Aplicação no Projeto:** Este estudo é a prova de que a abordagem funciona na prática. Os resultados positivos do artigo nos dão a confiança de que a aplicação de **streaks (sequências), recompensas e competição social** é uma estratégia eficaz para gerar mudanças comportamentais mensuráveis. Ele demonstra que um aplicativo com essas características é uma ferramenta com potencial real para ajudar os usuários a alcançar seus objetivos de saúde.

---

### 3. O Embasamento Psicológico do Engajamento (Baseado em Gabriel)

O artigo **["Beyond the Game: A Theoretical Framework for Gamification in Non-Gaming Contexts"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4750266)** fornece a base psicológica que explica *por que* a gamificação é eficaz. A estrutura teórica apresentada, alinhada com a **Teoria da Autodeterminação (Self-Determination Theory - SDT)**, argumenta que a motivação intríseca é sustentada por três necessidades psicológicas fundamentais: **Competência, Autonomia e Relações Sociais (Relatedness)**.

* **Aplicação no Projeto:** Nosso software foi projetado para satisfazer essas três necessidades:
    * **Competência:** O sentimento de ser capaz e eficaz é nutrido através de **níveis, missões concluídas e o acúmulo de streaks**. Cada meta batida reforça a percepção do usuário sobre sua própria capacidade.
    * **Autonomia:** A liberdade de escolha é garantida ao permitir que os usuários definam seus próprios hábitos, escolham com quem interagir e decidam entre um ambiente **cooperativo (times) ou competitivo (ranking)**.
    * **Relações Sociais:** A necessidade de conexão é atendida pelas funcionalidades sociais. Compartilhar o progresso e participar de desafios em grupo cria um senso de comunidade e **responsabilidade mútua**, que serve como uma poderosa rede de apoio.

---

### Conclusão

Em síntese, a arquitetura do nosso software não é arbitrária. Ela se fundamenta em princípios de engajamento (conforme Tiago), é validada por estudos de caso de sucesso em sua área de aplicação (conforme Leonardo) e é construída sobre um sólido framework psicológico (conforme Gabriel). Essa base tripla confere ao projeto uma grande probabilidade de sucesso em seu objetivo de ajudar os usuários a construir hábitos positivos de forma sustentável.

---

### Critérios de Seleção da Base Teórica

O objetivo foi construir uma argumentação sólida e multifacetada, onde cada artigo cumprisse uma função específica para justificar o projeto. Os critérios foram baseados em três necessidades de aplicação do projeto:

#### 1. Relevância Conceitual: Definir o **"O Quê"**

* **Objetivo da Busca:** Encontrar uma fonte que definisse claramente o conceito central do projeto — a gamificação — e suas mecânicas básicas de forma aplicada.
* **Critério de Inclusão:** Artigos que apresentassem uma definição acadêmica de gamificação e exemplificassem seus elementos principais (pontos, missões, rankings) como ferramentas de engajamento.
* **Critério de Exclusão:** Foram descartados artigos muito genéricos sobre teoria dos jogos ou excessivamente focados em um nicho que não se alinhava ao nosso (ex: gamificação em finanças corporativas).
* **Artigo Selecionado:** O artigo de **Tiago** foi escolhido por oferecer uma introdução clara e direta ao tema, validando o uso dos elementos que planejamos implementar.

#### 2. Validação Empírica: Provar o **"Se Funciona"**

* **Objetivo da Busca:** Encontrar evidências científicas de que a nossa abordagem específica — um app gamificado para hábitos saudáveis — é eficaz.
* **Critério de Inclusão:** Buscamos por estudos empíricos, preferencialmente ensaios clínicos randomizados (padrão-ouro da pesquisa), que testassem aplicativos com funcionalidades similares às nossas (streaks, social, recompensas) no contexto de saúde e bem-estar.
* **Critério de Exclusão:** Descartamos artigos de opinião, relatos de caso sem grupo de controle ou estudos sobre aplicativos com objetivos muito distintos dos nossos.
* **Artigo Selecionado:** O estudo de **Leonardo** foi ideal por ser um ensaio clínico que comprovou a eficácia de um app gamificado para os mesmos fins que o nosso, servindo como uma prova de conceito robusta.

#### 3. Profundidade Teórica: Explicar o **"Porquê"**

* **Objetivo da Busca:** Encontrar um framework teórico que explicasse os mecanismos psicológicos por trás do sucesso da gamificação.
* **Critério de Inclusão:** Artigos que conectassem as mecânicas de gamificação a teorias da motivação humana, como a Teoria da Autodeterminação (Competência, Autonomia, Relações Sociais).
* **Critério de Exclusão:** Foram descartados artigos que apenas listavam funcionalidades sem aprofundar em sua base psicológica ou que focavam apenas nos aspectos técnicos da implementação.
* **Artigo Selecionado:** O artigo de **Gabriel** foi selecionado por fornecer exatamente essa base teórica, permitindo-nos justificar cada funcionalidade do nosso app com base nas necessidades psicológicas fundamentais que ela visa atender.
