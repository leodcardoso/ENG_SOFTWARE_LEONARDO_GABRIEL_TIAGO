# Decisões de Arquitetura

Este documento detalha as duas principais arquiteturas que formam a base do nosso sistema, justificando suas escolhas e definindo suas implementações.

## 1. Arquitetura Cliente-Servidor

### Contexto
O projeto requer uma separação clara entre a interface do usuário (Frontend) e a lógica de negócios (Backend). Precisávamos de uma forma de comunicação padronizada, escalável e independente, que permitisse ao cliente (React/Expo Web) consumir dados e executar ações no servidor (Node.js) de forma `stateless`.

### Implementação
A arquitetura é composta por três componentes principais:

* **Cliente (React/Expo Web):**
    * Responsável por toda a interface do usuário e gerenciamento de estado local.
    * Comunica-se com a API via requisições HTTP/HTTPS (GET, POST, etc.).

* **API (Node.js/Express):**
    * Processa todas as requisições do cliente.
    * Implementa a lógica de negócios, gerencia autenticação e autorização.
    * Serve como intermediário para o banco de dados.

* **Banco de Dados (PostgreSQL):**
    * Armazena e persiste todos os dados da aplicação (usuários, hábitos, pontuações).

### Benefícios Comprovados
1.  **Separação de Responsabilidades:** O Frontend (UI) está totalmente desacoplado do Backend (lógica), permitindo que as equipes trabalhem de forma independente.
2.  **Escalabilidade:** O Backend pode ser escalado para múltiplos servidores sem afetar o Cliente.
3.  **Interface Padrão (REST):** O uso de uma API RESTful `stateless` fornece um contrato claro e padronizado para a comunicação.

---

## 2. Arquitetura em Camadas (Backend)

### Contexto
Para o Backend (API), era necessário um padrão de organização interna que evitasse o acoplamento da lógica de negócios com a lógica de acesso a dados ou com as definições de rotas (controllers). O objetivo principal era garantir alta manutenibilidade e testabilidade.

### Implementação
O servidor API é organizado em três camadas lógicas distintas:

* **Camada de Apresentação (Superior):**
    * Recebe as requisições HTTP e envia as respostas.
    * Contém os `Controllers` da API, `Middleware` de autenticação e `Validação` de requisições.

* **Camada de Negócios (Meio):**
    * Contém a lógica central da aplicação (regras de negócio).
    * Inclui os `Serviços` (ex: `HabitService`), lógica de gamificação e regras de hábitos.
    * Orquestra as operações na camada de dados.

* **Camada de Dados (Inferior):**
    * Abstrai o acesso ao banco de dados.
    * Contém os `Repositories` (Padrão de Projeto), `Models` e a lógica de conexão com o PostgreSQL.

### Benefícios Comprovados
1.  **Organização e Manutenibilidade:** O código é organizado por responsabilidade, tornando-o mais fácil de manter e entender.
2.  **Testabilidade:** Cada camada pode ser testada de forma isolada (ex: testar os `Serviços` da camada de negócios "mocando" os `Repositories` da camada de dados).
3.  **Flexibilidade:** Mudanças em uma camada (ex: otimizar uma query SQL na Camada de Dados) não afetam as outras camadas (como a Camada de Negócios).