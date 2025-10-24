# Decisões de Arquitetura (ADR)

Status: rascunho

## Contexto
Descrição curta do problema a resolver.

## Decisão
- Arquitetura: cliente React Native (Expo) + Backend Node.js simples (JSON durante protótipo)
- Padrões: Observer para notificações, Strategy para scoring, Command para ações do usuário

## Consequências
- Simplicidade no protótipo; migrar para banco real quando necessário.