-- Criação dos tipos ENUM customizados
CREATE TYPE invite_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

CREATE TYPE notification_type AS ENUM (
    'FRIEND_REQUEST',
    'FRIEND_ACCEPTED',
    'CHALLENGE_INVITE',
    'CHALLENGE_JOINED',
    'HABIT_REMINDER',
    'ACHIEVEMENT',
    'LEVEL_UP'
);

CREATE TYPE user_role AS ENUM ('ADMIN', 'MEMBER', 'MODERATOR');

COMMENT ON TYPE invite_status IS 'Status possíveis para convites (amizade e desafios)';
COMMENT ON TYPE notification_type IS 'Tipos de notificações do sistema';
COMMENT ON TYPE user_role IS 'Papéis de usuários em desafios';
-- Tabela de usuários
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    points INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    avatar_url TEXT
);

COMMENT ON TABLE users IS 'Tabela de usuários do sistema';
COMMENT ON COLUMN users.id IS 'Identificador único do usuário';
COMMENT ON COLUMN users.name IS 'Nome completo do usuário';
COMMENT ON COLUMN users.email IS 'Email único do usuário para login';
COMMENT ON COLUMN users.password_hash IS 'Hash da senha do usuário (bcrypt)';
COMMENT ON COLUMN users.created_at IS 'Data e hora de criação do registro';
COMMENT ON COLUMN users.updated_at IS 'Data e hora da última atualização';
COMMENT ON COLUMN users.points IS 'Pontuação total acumulada pelo usuário';
COMMENT ON COLUMN users.level IS 'Nível atual do usuário baseado em pontos';
COMMENT ON COLUMN users.avatar_url IS 'URL da imagem de perfil do usuário';

-- Tabela de configurações de usuário
CREATE TABLE settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notifications BOOLEAN NOT NULL DEFAULT TRUE,
    reminders_default TIME,
    private_by_default BOOLEAN NOT NULL DEFAULT FALSE,
    language VARCHAR(10) DEFAULT 'pt-BR',
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE settings IS 'Configurações personalizadas de cada usuário';
COMMENT ON COLUMN settings.id IS 'Identificador único da configuração';
COMMENT ON COLUMN settings.user_id IS 'Referência ao usuário dono das configurações';
COMMENT ON COLUMN settings.notifications IS 'Indica se o usuário deseja receber notificações';
COMMENT ON COLUMN settings.reminders_default IS 'Horário padrão para lembretes de hábitos';
COMMENT ON COLUMN settings.private_by_default IS 'Define se novos hábitos são privados por padrão';
COMMENT ON COLUMN settings.language IS 'Idioma preferido do usuário';
COMMENT ON COLUMN settings.timezone IS 'Fuso horário do usuário';
COMMENT ON COLUMN settings.updated_at IS 'Data e hora da última atualização';

-- Tabela de hábitos
CREATE TABLE habits (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    points INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_check_in DATE,
    expiration_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_private BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE habits IS 'Tabela de hábitos criados pelos usuários';
COMMENT ON COLUMN habits.id IS 'Identificador único do hábito';
COMMENT ON COLUMN habits.user_id IS 'Referência ao usuário dono do hábito';
COMMENT ON COLUMN habits.title IS 'Título/nome do hábito';
COMMENT ON COLUMN habits.description IS 'Descrição detalhada do hábito';
COMMENT ON COLUMN habits.category IS 'Categoria do hábito (saúde, produtividade, etc)';
COMMENT ON COLUMN habits.points IS 'Pontos ganhos ao completar o hábito';
COMMENT ON COLUMN habits.active IS 'Indica se o hábito está ativo';
COMMENT ON COLUMN habits.last_check_in IS 'Data do último check-in realizado';
COMMENT ON COLUMN habits.expiration_date IS 'Data de expiração/término do hábito';
COMMENT ON COLUMN habits.created_at IS 'Data e hora de criação do hábito';
COMMENT ON COLUMN habits.updated_at IS 'Data e hora da última atualização';
COMMENT ON COLUMN habits.is_private IS 'Define se o hábito é privado ou público';
-- Tabela de desafios
CREATE TABLE challenges (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    expiration_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE challenges IS 'Tabela de desafios criados pelos usuários';
COMMENT ON COLUMN challenges.id IS 'Identificador único do desafio';
COMMENT ON COLUMN challenges.owner_id IS 'Referência ao usuário criador do desafio';
COMMENT ON COLUMN challenges.title IS 'Título do desafio';
COMMENT ON COLUMN challenges.description IS 'Descrição detalhada do desafio';
COMMENT ON COLUMN challenges.category IS 'Categoria do desafio';
COMMENT ON COLUMN challenges.expiration_date IS 'Data de término do desafio';
COMMENT ON COLUMN challenges.created_at IS 'Data e hora de criação do desafio';
COMMENT ON COLUMN challenges.updated_at IS 'Data e hora da última atualização';
COMMENT ON COLUMN challenges.is_active IS 'Indica se o desafio está ativo';
-- Tabela de membros de desafios
CREATE TABLE challenge_members (
    challenge_id BIGINT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_points INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (challenge_id, user_id)
);

COMMENT ON TABLE challenge_members IS 'Tabela de relacionamento entre desafios e seus membros';
COMMENT ON COLUMN challenge_members.challenge_id IS 'Referência ao desafio';
COMMENT ON COLUMN challenge_members.user_id IS 'Referência ao usuário membro';
COMMENT ON COLUMN challenge_members.role IS 'Papel do usuário no desafio (admin, membro, moderador)';
COMMENT ON COLUMN challenge_members.joined_at IS 'Data e hora em que o usuário entrou no desafio';
COMMENT ON COLUMN challenge_members.user_points IS 'Pontos acumulados pelo usuário neste desafio';
COMMENT ON COLUMN challenge_members.is_active IS 'Indica se o membro está ativo no desafio';

-- Tabela de amizades
CREATE TABLE friendships (
    user_id_a BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id_b BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    since_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id_a, user_id_b),
    CONSTRAINT friendships_different_users CHECK (user_id_a < user_id_b)
);

COMMENT ON TABLE friendships IS 'Tabela de relacionamento de amizades entre usuários';
COMMENT ON COLUMN friendships.user_id_a IS 'Referência ao primeiro usuário da amizade (menor ID)';
COMMENT ON COLUMN friendships.user_id_b IS 'Referência ao segundo usuário da amizade (maior ID)';
COMMENT ON COLUMN friendships.since_at IS 'Data e hora em que a amizade foi estabelecida';

-- Tabela de convites de amizade
CREATE TABLE friend_invites (
    id BIGSERIAL PRIMARY KEY,
    sender_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status invite_status NOT NULL DEFAULT 'PENDING',
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT friend_invites_different_users CHECK (sender_user_id <> receiver_user_id),
    UNIQUE (sender_user_id, receiver_user_id) 
);

COMMENT ON TABLE friend_invites IS 'Tabela de convites de amizade entre usuários';
COMMENT ON COLUMN friend_invites.id IS 'Identificador único do convite';
COMMENT ON COLUMN friend_invites.sender_user_id IS 'Referência ao usuário que enviou o convite';
COMMENT ON COLUMN friend_invites.receiver_user_id IS 'Referência ao usuário que recebeu o convite';
COMMENT ON COLUMN friend_invites.status IS 'Status atual do convite (pendente, aceito, rejeitado, cancelado)';
COMMENT ON COLUMN friend_invites.message IS 'Mensagem opcional enviada com o convite';
COMMENT ON COLUMN friend_invites.created_at IS 'Data e hora de criação do convite';
COMMENT ON COLUMN friend_invites.updated_at IS 'Data e hora da última atualização do status';

-- Tabela de convites para desafios
CREATE TABLE challenge_invites (
    id BIGSERIAL PRIMARY KEY,
    sender_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id BIGINT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    status invite_status NOT NULL DEFAULT 'PENDING',
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT challenge_invites_different_users CHECK (sender_user_id <> receiver_user_id),
    UNIQUE (challenge_id, receiver_user_id)
);

COMMENT ON TABLE challenge_invites IS 'Tabela de convites para participação em desafios';
COMMENT ON COLUMN challenge_invites.id IS 'Identificador único do convite';
COMMENT ON COLUMN challenge_invites.sender_user_id IS 'Referência ao usuário que enviou o convite';
COMMENT ON COLUMN challenge_invites.receiver_user_id IS 'Referência ao usuário que recebeu o convite';
COMMENT ON COLUMN challenge_invites.challenge_id IS 'Referência ao desafio para o qual foi convidado';
COMMENT ON COLUMN challenge_invites.status IS 'Status atual do convite (pendente, aceito, rejeitado, cancelado)';
COMMENT ON COLUMN challenge_invites.message IS 'Mensagem opcional enviada com o convite';
COMMENT ON COLUMN challenge_invites.created_at IS 'Data e hora de criação do convite';
COMMENT ON COLUMN challenge_invites.updated_at IS 'Data e hora da última atualização do status';

-- Tabela de notificações
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    type notification_type NOT NULL,
    habit_id BIGINT REFERENCES habits(id) ON DELETE CASCADE,
    challenge_id BIGINT REFERENCES challenges(id) ON DELETE CASCADE,
    friend_invite_id BIGINT REFERENCES friend_invites(id) ON DELETE CASCADE,
    challenge_invite_id BIGINT REFERENCES challenge_invites(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}',
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT notifications_one_target CHECK (
        (CASE WHEN habit_id IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN challenge_id IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN friend_invite_id IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN challenge_invite_id IS NOT NULL THEN 1 ELSE 0 END) = 1
    )
);

COMMENT ON TABLE notifications IS 'Tabela de notificações do sistema para usuários';
COMMENT ON COLUMN notifications.id IS 'Identificador único da notificação';
COMMENT ON COLUMN notifications.recipient_user_id IS 'Referência ao usuário que receberá a notificação';
COMMENT ON COLUMN notifications.actor_user_id IS 'Referência ao usuário que gerou o evento (pode ser nulo)';
COMMENT ON COLUMN notifications.type IS 'Tipo da notificação (friend_request, achievement, etc)';
COMMENT ON COLUMN notifications.habit_id IS 'Referência opcional ao hábito relacionado';
COMMENT ON COLUMN notifications.challenge_id IS 'Referência opcional ao desafio relacionado';
COMMENT ON COLUMN notifications.friend_invite_id IS 'Referência opcional ao convite de amizade relacionado';
COMMENT ON COLUMN notifications.challenge_invite_id IS 'Referência opcional ao convite de desafio relacionado';
COMMENT ON COLUMN notifications.data IS 'Dados extras em formato JSON para informações adicionais';
COMMENT ON COLUMN notifications.read_at IS 'Data e hora em que a notificação foi lida (nulo se não lida)';
COMMENT ON COLUMN notifications.created_at IS 'Data e hora de criação da notificação';


-- Índices para otimização de performance

-- Índices para usuários
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_points ON users(points DESC);

-- Índices para hábitos
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_active ON habits(active) WHERE active = TRUE;
CREATE INDEX idx_habits_category ON habits(category);
CREATE INDEX idx_habits_expiration ON habits(expiration_date) WHERE expiration_date IS NOT NULL;

-- Índices para desafios
CREATE INDEX idx_challenges_owner_id ON challenges(owner_id);
CREATE INDEX idx_challenges_category ON challenges(category);
CREATE INDEX idx_challenges_active ON challenges(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_challenges_expiration ON challenges(expiration_date) WHERE expiration_date IS NOT NULL;

-- Índices para membros de desafios
CREATE INDEX idx_challenge_members_user_id ON challenge_members(user_id);
CREATE INDEX idx_challenge_members_points ON challenge_members(challenge_id, user_points DESC);

-- Índices para amizades
CREATE INDEX idx_friendships_user_a ON friendships(user_id_a);
CREATE INDEX idx_friendships_user_b ON friendships(user_id_b);

-- Índices para convites de amizade
CREATE INDEX idx_friend_invites_sender ON friend_invites(sender_user_id);
CREATE INDEX idx_friend_invites_receiver ON friend_invites(receiver_user_id);
CREATE INDEX idx_friend_invites_status ON friend_invites(status) WHERE status = 'PENDING';

-- Índices para convites de desafio
CREATE INDEX idx_challenge_invites_sender ON challenge_invites(sender_user_id);
CREATE INDEX idx_challenge_invites_receiver ON challenge_invites(receiver_user_id);
CREATE INDEX idx_challenge_invites_challenge ON challenge_invites(challenge_id);
CREATE INDEX idx_challenge_invites_status ON challenge_invites(status) WHERE status = 'PENDING';

-- Índices para notificações
CREATE INDEX idx_notifications_recipient_unread ON notifications(recipient_user_id, created_at DESC) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

COMMENT ON INDEX idx_users_email IS 'Índice para busca rápida por email';
COMMENT ON INDEX idx_notifications_recipient_unread IS 'Índice para buscar notificações não lidas de um usuário';