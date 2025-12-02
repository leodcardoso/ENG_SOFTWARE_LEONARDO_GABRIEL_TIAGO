# 🛠️ Trabalho 3: Testes, Manutenção e TDD

Este diretório contém os entregáveis referentes à **Terceira Entrega** da disciplina de Engenharia de Software. O foco desta etapa foi a garantia de qualidade (QA), refatoração de código legado e implementação de novas funcionalidades utilizando TDD (Test Driven Development).

---

##  Resumo das Entregas

### 1\. Testes e Documentação (60%)

  * **Plano de Testes (Apêndice B):** Disponível em [`docs/testes.md`].
  * **Cenários de Teste (Apêndice C):** Documentados para Autenticação, Hábitos e Notificações.
  * **Relatório de Cobertura (Apêndice D):** Tabela consolidada das funcionalidades testadas.
  * ***Ambos uldtimos disponiveis de maneira individual em [`docs/teste(Nome do responsavel).md`]

### 2\. Manutenção e TDD (40%)

As alterações técnicas foram detalhadas no relatório individuais em [`/testes/...`].

  * **Refatoração (Manutenção):**
      * Melhoria no tratamento de erros do `AuthController` (HTTP 409/500).
      * Implementação de segurança "Fail Fast" no `HabitController` (Validação de ID).
  * **TDD (Novas Funcionalidades):**
      * **Validação de Senha Forte:** Ciclo Red/Green/Refactor completo.
      * **Validação de Hábito:** Criação de validadores utilitários.

### 3\. Demonstração (10%)

  * **Slides:** Arquivo PDF disponível na pasta `docs`.
  * **Vídeo de Demonstração:** [INSIRA O LINK DO SEU VÍDEO AQUI OU "Disponível no Moodle"]

-----

##  Como Executar os Testes (TDD)

Para validar os ciclos de TDD implementados nesta entrega, siga os passos abaixo no terminal:

1.  Acesse a pasta do Backend:

    ```bash
    cd "../Parte 2/EngSoftware/Backend"
    ```

2.  Instale as dependências (caso não tenha feito):

    ```bash
    npm install
    ```

3.  Execute a suíte de testes automatizados:

    ```bash
    npm test
    ```

**Resultado Esperado:**
O terminal deve exibir os testes de `passwordValidator` e `habitValidator` com status **PASS** (Verde).

-----

## 👥 Responsáveis

  * **Tiago Bettanin:**
  * **Gabriel:** 
  * **Leonardo:** 

<!-- end list -->

---

## 📂 Organização do Projeto (Entrega T3)

Abaixo, a estrutura de arquivos organizada para facilitar a correção e navegação entre códigos e documentos.

```text
Parte 3/
├── README.md                   # (Este arquivo) Guia geral da entrega
├── Slides.pdf                  #  Apresentação de slides
├── docs/                       # Documentação Técnica
│   ├── testes.md               # Plano de Testes Geral (Apêndices B, C, D)
│   ├── testesTiago.md          # Relatório Técnico Detalhado (TDD e Refatoração - Tiago)
│   ├── tarefasT3.md            # Controle de atividades
│   └── Trabalho 3.pdf          # Slides da Apresentação
└── testes/
    └── arquivos/
        └── Tiago/              # Evidências Visuais (Prints)
            ├── authController.png
            ├── TDD_senha_RED.png
            ├── TDD_senha_GREEN.png
            └── ... (demais evidências citadas nos relatórios)

> **Nota:** O código fonte modificado (Refatoração e TDD) encontra-se na pasta `Parte 2/EngSoftware`, conforme padrão de desenvolvimento do projeto.


```

---