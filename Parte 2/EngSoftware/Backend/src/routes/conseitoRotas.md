/auth
    /login
        Recebe:
        -Email
        -senha
        Retorna:
        -Token
        -Dados do usuario
            -userId
            -Nome
            -Pontos
            -Nivel

    /register   
        Recebe:
        -Nome
        -Email
        -Senha
        -Bio 
        -Horario Notificação
        Retorna:
        -Token
        -userId
        -Nome
        -Pontos
        -Nivel
    /logout (não tem)



- Diferença entre habito e desafio é se é privado ou não

/habits
    CRUD com post, get...
        -Cria
        -Buscar
    /checkin:habitId
/challenges
    CRUD com post, get...
        -Cria
        -Buscar
    /invit (Só na criação)
        -json com todos os usuarios no body
    /checkin:challengId
        Retorna:
        -bool se deu certo
    /allUsers (Ranking)
        Envia:
        - Token usuario
        - challengId
        Retorna:
        - userName
            -points
            -colocação
/friend
    /invit:targetUser (userId)
    /status:resquestId
        Retorna:
        -bool, se deu certo ou não

/user
    CRUD com post, get...
        -Buscar
        -Atualizar
    /friends
        Envia:
        - Token User
        Retorna:
        - userId amigo
        - nome amigo
    /allHabits
    /allChallenges
    /notifications (Pega todas)
        Envia:
        - Token User
        Retorna:
        - Notificação
            -Tipo
            -Data
            -Descrição
    /search
        Envia:
        - Nome (body)
        Retorna: 
        - bool se existe, userId e se é amigo já 
/ generic
    (Não uso, usos futuros)