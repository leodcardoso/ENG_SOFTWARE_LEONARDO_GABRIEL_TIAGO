nextId que é os Auto increment do SQL
Tipos:
- invite_status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELED' | 'EXPIRED'
- notification_type: 'HABIT_REMINDER' | 'HABIT_COMPLETED' | 'CHALLENGE_INVITE' | 'CHALLENGE_UPDATED' | 'FRIEND_INVITE' | 'FRIEND_ACCEPTED'

Users:
    id: int, unico
    name: string
    email: string, unico
    -role: string
    createAt: data e Hora
    points: int
    level: int

settings:
    userId: int, unico, mesmo id da tabela users
    notifications: bool
    remindersDefault: hora
    privateByDefault: bool

friends:
    userId: int, id de alguem
    userId2: int, id de alguem

habits:
  id: bigserial, PK
  user_id: bigint, FK -> users(id), on delete cascade
  title: text, obrigatório
  created_at: timestamptz, default now()
  pontos
  description: string
  lastCheckIn : data (Simples, dia)
  active: bool
  dataQueExpira: Dia apenas
  -privacy: string
  createdAt: data completa
  -Categoria

challenges:
  - id: bigserial, PK
  - owner_id: bigint, FK -> users(id), on delete cascade
  - title: text, obrigatório
  - created_at: timestamptz, default now()
  - Data de expiração
  - Categoria
  - Descrição

challenge_members:
  - challenge_id: bigint, FK -> challenges(id), on delete cascade
  - user_id: bigint, FK -> users(id), on delete cascade
  - role: text, default 'MEMBER'
  - joined_at: timestamptz, default now()
  - pontos usuario
  - PK: (challenge_id, user_id)

friendships:
  - user_id_a: bigint, FK -> users(id), on delete cascade
  - user_id_b: bigint, FK -> users(id), on delete cascade
  - since_at: timestamptz, default now()
  - PK: (user_id_a, user_id_b)
  - Regra: user_id_a < user_id_b (evita duplicidade invertida)

friend_invites:
  - id: bigserial, PK
  - sender_user_id: bigint, FK -> users(id), on delete cascade
  - receiver_user_id: bigint, FK -> users(id), on delete cascade
  - status: invite_status, default 'PENDING'
  - message: text, opcional (padrão sem nada, back coloca uma default)
  - created_at: timestamptz, default now()
  - updated_at: timestamptz, default now()
  - Índice único (pendentes): (sender_user_id, receiver_user_id) where status='PENDING'

challenge_invites:
  - id: bigserial, PK
  - sender_user_id: bigint, FK -> users(id), on delete cascade
  - receiver_user_id: bigint, FK -> users(id), on delete cascade
  - challenge_id: bigint, FK -> challenges(id), on delete cascade
  - status: invite_status, default 'PENDING'
  - message: text, opcional (padrão sem nada, back coloca uma default)
  - created_at: timestamptz, default now()
  - updated_at: timestamptz, default now()
  - Índice único (pendentes): (challenge_id, receiver_user_id) where status='PENDING'

notifications:
  - id: bigserial, PK
  - recipient_user_id: bigint, FK -> users(id), on delete cascade
  - actor_user_id: bigint, FK -> users(id), on delete set null
  - type: notification_type, obrigatório
  - Alvo (exatamente 1):
    - habit_id: bigint, FK -> habits(id), on delete cascade
    - challenge_id: bigint, FK -> challenges(id), on delete cascade
    - friend_invite_id: bigint, FK -> friend_invites(id), on delete cascade
    - challenge_invite_id: bigint, FK -> challenge_invites(id), on delete cascade
  - data: jsonb, default '{}'
  - read_at: timestamptz, opcional
  - created_at: timestamptz, default now()
  - Regra: notifications_one_target (garante 1 único alvo)

Índices úteis:
  - idx_notifications_recipient_unread: (recipient_user_id, created_at desc) where read_at is null
  - idx_notifications_type: (type)


habits:
    id: int, unico
    userId: int, unico
    title: string
    pontos
    - frequency: 
    - schedule (table)
    - reminders (table)
    - streak (falta calendario)
    - bestStreak (falta streak)
    - pointsPerCheckIn (falta numero de checkin)
    - jokerUsedDates


-tasks
    -id 
    -title
    -ownerId
    -category
    -status
    -output
    -createdAt

-challenges
-achievements
-userAchievements
-- Tipos


create type invite_status as enum ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELED', 'EXPIRED');
create type notification_type as enum (
  'HABIT_REMINDER',
  'HABIT_COMPLETED',
  'CHALLENGE_INVITE',
  'CHALLENGE_UPDATED',
  'FRIEND_INVITE',
  'FRIEND_ACCEPTED'
);

-- Usuários
create table users (
  id bigserial primary key,
  username text not null unique,
  created_at timestamptz not null default now()
);

-- Hábitos
create table habits (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  title text not null,
  reminder_at time,
  created_at timestamptz not null default now()
);

-- Desafios
create table challenges (
  id bigserial primary key,
  owner_id bigint not null references users(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create table challenge_members (
  challenge_id bigint not null references challenges(id) on delete cascade,
  user_id bigint not null references users(id) on delete cascade,
  role text not null default 'MEMBER',
  joined_at timestamptz not null default now(),
  primary key (challenge_id, user_id)
);

-- Amizades (após aceitar)
create table friendships (
  user_id_a bigint not null references users(id) on delete cascade,
  user_id_b bigint not null references users(id) on delete cascade,
  since_at timestamptz not null default now(),
  primary key (user_id_a, user_id_b),
  constraint friendships_order check (user_id_a < user_id_b)
);

-- Convites de amizade
create table friend_invites (
  id bigserial primary key,
  sender_user_id bigint not null references users(id) on delete cascade,
  receiver_user_id bigint not null references users(id) on delete cascade,
  status invite_status not null default 'PENDING',
  message text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Evita múltiplos convites pendentes entre o mesmo par
create unique index uq_friend_invite_pending
  on friend_invites(sender_user_id, receiver_user_id)
  where status = 'PENDING';

-- Convites de desafio
create table challenge_invites (
  id bigserial primary key,
  sender_user_id bigint not null references users(id) on delete cascade,
  receiver_user_id bigint not null references users(id) on delete cascade,
  challenge_id bigint not null references challenges(id) on delete cascade,
  status invite_status not null default 'PENDING',
  message text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index uq_challenge_invite_pending
  on challenge_invites(challenge_id, receiver_user_id)
  where status = 'PENDING';

-- Notificações
create table notifications (
  id bigserial primary key,
  recipient_user_id bigint not null references users(id) on delete cascade,
  actor_user_id bigint references users(id) on delete set null, -- quem gerou o evento
  type notification_type not null,
  -- Referências opcionais (apenas uma deve ser preenchida)
  habit_id bigint references habits(id) on delete cascade,
  challenge_id bigint references challenges(id) on delete cascade,
  friend_invite_id bigint references friend_invites(id) on delete cascade,
  challenge_invite_id bigint references challenge_invites(id) on delete cascade,
  -- Dados extras livres
  data jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint notifications_one_target check (
    (case when habit_id is not null then 1 else 0 end) +
    (case when challenge_id is not null then 1 else 0 end) +
    (case when friend_invite_id is not null then 1 else 0 end) +
    (case when challenge_invite_id is not null then 1 else 0 end) = 1
  )
);

-- Índices úteis
create index idx_notifications_recipient_unread
  on notifications(recipient_user_id, created_at desc)
  where read_at is null;

create index idx_notifications_type on notifications(type);