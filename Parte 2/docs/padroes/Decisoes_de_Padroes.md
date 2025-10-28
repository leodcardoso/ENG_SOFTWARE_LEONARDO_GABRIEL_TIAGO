# Decisões de Padrões de Projeto

## 1. Container/Presentational (Frontend)

### Contexto
Nossa aplicação React precisa gerenciar estados complexos (loading, error, data) e renderizar UI de forma reutilizável.

### Implementação
- **Container Components:**
  - `HabitContainer.tsx`: Gerencia estado e lógica
    ```typescript
    interface HabitContainerState {
      habits: Habit[];
      isLoading: boolean;
      error: Error | null;
    }
    ```
  - Responsabilidades:
    - Chamadas à API
    - Gestão de estado
    - Manipulação de erros
    - Callbacks de eventos

- **Presentational Components:**
  - `HabitList.tsx`: Lista de hábitos
  - `HabitItem.tsx`: Item individual
  - Apenas recebem props e renderizam UI

### Benefícios Comprovados
1. **Testabilidade:**
   - Containers: Teste de lógica/estado
   - Presentational: Teste de renderização

2. **Reusabilidade:**
   - Components UI podem ser reutilizados
   - Lógica centralizada nos containers

3. **Manutenibilidade:**
   - Separação clara de responsabilidades
   - Mudanças de UI não afetam lógica

## 2. Observer (Backend)

### Contexto
Sistema precisa notificar usuários sobre diversos eventos (check-in de hábitos, conquistas, etc.).

### Implementação
- **Subject (NotificationCenter):**
  ```typescript
  interface INotificationSubject {
    attach(observer: IObserver): void;
    detach(observer: IObserver): void;
    notify(event: NotificationEvent): void;
  }
  ```

- **Observers:**
  ```typescript
  interface IObserver {
    update(event: NotificationEvent): void;
  }
  
  class PushNotificationObserver implements IObserver {
    update(event: NotificationEvent): void {
      // Envia push notification
    }
  }
  
  class EmailNotificationObserver implements IObserver {
    update(event: NotificationEvent): void {
      // Envia email
    }
  }
  ```

### Benefícios Comprovados
1. **Desacoplamento:**
   - Serviços não conhecem detalhes de notificação
   - Novos tipos de notificação sem alterar código existente

2. **Escalabilidade:**
   - Fácil adicionar novos observers
   - Sistema distribuído de notificações

## 3. Repository (Backend)

### Contexto
Necessidade de abstrair acesso ao PostgreSQL e facilitar testes.

### Implementação
- **Interface Genérica:**
  ```typescript
  interface IRepository<T> {
    getById(id: string): Promise<T>;
    getAll(): Promise<T[]>;
    create(data: T): Promise<T>;
    update(id: string, data: T): Promise<T>;
    delete(id: string): Promise<void>;
  }
  ```

- **Implementações Concretas:**
  ```typescript
  class HabitRepository implements IRepository<Habit> {
    private db: PostgresConnection;
    
    async getById(id: string): Promise<Habit> {
      // Query SQL específica para hábitos
    }
    // ... outros métodos
  }
  ```

- **Uso nos Services:**
  ```typescript
  class HabitService {
    constructor(private habitRepo: IRepository<Habit>) {}
    
    async completeHabit(id: string): Promise<void> {
      const habit = await this.habitRepo.getById(id);
      // Lógica de negócio
    }
  }
  ```

### Benefícios Comprovados
1. **Isolamento:**
   - Lógica SQL centralizada
   - Mudanças no banco afetam só repositories

2. **Testabilidade:**
   - Fácil mockar repositories em testes
   - Testes unitários sem banco real

3. **Manutenibilidade:**
   - Interface consistente
   - Queries organizadas por entidade

### Diagramas dos Padrões de Projeto

#### 1. Container/Presentational Pattern
![Container/Presentational](./diagramaProjetosA.png.svg)

**Explicação do Diagrama:**
O diagrama ilustra a hierarquia de componentes React, onde o HabitContainer (componente smart) gerencia o estado e a lógica, enquanto HabitList e HabitItem (componentes dumb) focam apenas na renderização. As setas verdes mostram o fluxo de props descendente e as azuis o fluxo de callbacks ascendente.

#### 2. Observer Pattern
![Observer](./diagramaProjetosB.png.svg)

**Explicação do Diagrama:**
O diagrama demonstra a implementação do Observer para notificações, onde NotificationSubject mantém uma lista de observers (UserObserver e HabitObserver) e os notifica de mudanças. O NotificationService utiliza esta estrutura para gerenciar as notificações de forma desacoplada.

#### 3. Repository Pattern
![Repository](./diagramaProjetosC.png.svg)

**Explicação do Diagrama:**
O diagrama mostra como o padrão Repository abstrai o acesso ao banco de dados através de uma interface genérica IRepository<T>. Os repositories concretos (User, Habit, Progress) implementam esta interface, enquanto os services dependem apenas da abstração, não das implementações específicas.