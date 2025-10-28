# Plano de Gestão da Qualidade

Resumo do plano: objetivos, papéis, métricas e checklist de aceitação.

## Objetivos de qualidade
- Entrega com bugs críticos <= 1 por sprint
- Cobertura mínima de testes: 30% (meta inicial)

## Papéis
- Gabriel — Owner (Gerência de Qualidade)
- Leonardo — Reviewer
- Tiago — Reviewer

## Processos
- Pull requests com checklist obrigatório
- Revisão por pares e CI rodando linters/tests

## Métricas e checkpoints
- Checklist de PR
- Relatórios de cobertura
- Registro no CHANGELOG.md


---


1. Detalhes sobre os Papéis
Você listou os revisores do plano, mas precisamos definir as responsabilidades de execução do dia a dia:

Arquiteto: Quem é o responsável por definir e revisar os padrões de arquitetura e os Padrões de Projeto? (Imagino que seja o Tiago, baseado no histórico).Fizemos uma reuni~ção onde foi discutido quais padrões seriao os escolhindos

QA (Controle de Qualidade): Quem é o responsável final por validar uma funcionalidade antes dela ser aprovada? É o próprio revisor do PR? Vocês farão testes cruzados (ex: Gabriel testa o código do Leonardo)? Fizemos uma revisção cruzada com objetivo de todos conseguirem ter o minimo pelo menos de visão do projeto inteiro

Desenvolvedor: Quais são as responsabilidades de qualidade do dev (além de codar)? (ex: "Escrever testes unitários para a lógica implementada").
Realizar teste para o minimo de erros, seguir a organização das pastas ...

2. Padrões de Desenvolvimento (O "Como Codar")
Você mencionou linters/tests, mas precisamos definir os padrões que o CI vai verificar:
Testar Localmente (End-to-End)

Fluxo de Git (Git Flow): Qual é o fluxo de branches de vocês? (Ex: main para produção, develop para integração, e feature/* para trabalho?)
só subimos codigo testados e garantimos com os demais colegas que não vamos sobre escrever nenhm codigo

Convenção de Commits: Vocês vão usar um padrão? (Ex: Conventional Commits, como feat:, fix:, docs:, etc.)
usamos conventional commits por serem mais usuais

Ferramentas de Linter: Quais ferramentas vocês estão usando? (Ex: ESLint, Prettier)
não sei se usamos isso

3. Padrões de Documentação
Checklist de PR: Quais são os itens exatos que devem estar no checklist do Pull Request? (Ex: [ ] Testei localmente, [ ] Atualizei a documentação, [ ] Código segue o linter).
    faça algo desse tipo, mas fale que não subimos cada teste para quanod utillizamos. Testei Localmente:**;Documentação:** (Se aplicável), avise os amigos, ...

CHANGELOG.md: Como ele deve ser preenchido? A cada PR? A cada release?
dividimos o changelog em tres arquivos md conseitoRotas Consito DB COnseitoFuções, onde temos topicos riscadas ( ~~Exemplo de riscado~~ ), pq temos planos de fazer em versões futuras


4. Padrões Não Funcionais (Definindo "Qualidade")
Esta é a parte mais importante. "Qualidade" não é só "sem bugs".

Performance: Qual é o tempo de resposta aceitável para uma requisição da API? (Ex: "menos de 500ms").
menos de 500ms

Segurança: Quais são os padrões mínimos? (Ex: "Senhas devem usar bcrypt", "Nenhuma chave de API deve estar no código, usar .env").
Utilizamos bcrypt para senhas e também .env e tambel token da bilioteca js { jwtDecode } from "jwt-decode"; 

Tratamento de Erros: Como a API deve se comportar em caso de erro? (Ex: "Retornar um JSON padronizado com { success: false, message: '...' } e o código HTTP correto").

Logs: O que o servidor deve logar? (Ex: "Apenas erros críticos" ou "Todas as requisições").

5. Detalhes do Processo de QA
Cobertura de Testes (30%): Isso se aplica ao Backend, Frontend, ou ambos?
Ambos, no bakend utilizamos o Postman para realizar teste, e no front na propria UI

Checklist de Aceite: Onde os critérios de aceite de uma tarefa são definidos? (Ex: Em um card do Trello? Na própria Issue do Git?).

Gestão de Bugs: Se vocês encontrarem um bug (que não seja crítico <= 1), qual é o processo? (Ex: "Registrar no Trello", "Priorizar na próxima sprint").
Priorizar na proxima sprint, por priorizar essenciasi(deixar mais suave e bonito essa resonsta)