# Guia de Configuração - Sistema de Agendamento de Higienização de Veículos

## Visão Geral

Este sistema automatiza o agendamento de higienização de veículos, integrando um formulário elegante, notificações via Telegram e confirmações por e-mail.

## Arquitetura

O sistema funciona em três etapas principais:

1. **Seleção e Agendamento**: O consultor seleciona seu perfil e preenche os dados do veículo
2. **Notificação Telegram**: O higienizador recebe uma mensagem no Telegram com os dados e um botão de confirmação
3. **Confirmação por E-mail**: Após confirmar no Telegram, o consultor recebe um e-mail de confirmação

## Variáveis de Ambiente Necessárias

### Telegram Bot

```env
TELEGRAM_BOT_TOKEN=seu_token_aqui
TELEGRAM_CLEANER_CHAT_ID=seu_chat_id_aqui
```

**Como obter:**
1. Crie um bot no Telegram usando [@BotFather](https://t.me/botfather)
2. Copie o token fornecido
3. Inicie uma conversa com seu bot e obtenha o Chat ID usando [@userinfobot](https://t.me/userinfobot)

### Configuração de E-mail (SMTP)

```env
SMTP_HOST=smtp.seu_provedor.com
SMTP_PORT=587
SMTP_USER=seu_email@empresa.com
SMTP_PASSWORD=sua_senha_ou_app_password
SMTP_FROM_EMAIL=noreply@empresa.com
```

**Exemplos de Provedores:**
- **Gmail**: `smtp.gmail.com:587` (use App Password, não senha normal)
- **Outlook**: `smtp-mail.outlook.com:587`
- **SendGrid**: `smtp.sendgrid.net:587`

## Estrutura de Arquivos

```
higienizacao-veiculos/
├── consultores.json              # Lista de consultores cadastrados
├── client/src/
│   ├── pages/
│   │   ├── Home.tsx             # Página principal (fluxo)
│   │   ├── ConsultorSelect.tsx  # Seleção de consultor
│   │   └── AgendamentoForm.tsx  # Formulário de agendamento
│   └── index.css                # Estilos elegantes
├── server/
│   ├── consultores.ts           # Gerenciamento de consultores
│   ├── agendamentos.ts          # Lógica de agendamentos
│   ├── telegram.ts              # Integração Telegram
│   ├── email.ts                 # Envio de e-mails
│   ├── webhooks.ts              # Webhook do Telegram
│   └── routers.ts               # APIs tRPC
└── shared/
    └── types.ts                 # Tipos e schemas Zod
```

## Gerenciamento de Consultores

### Adicionar Consultor

Edite `consultores.json`:

```json
[
  {
    "id": "cons-001",
    "nome": "João Silva",
    "email": "joao.silva@empresa.com"
  },
  {
    "id": "cons-002",
    "nome": "Maria Santos",
    "email": "maria.santos@empresa.com"
  }
]
```

### Remover Consultor

Remova o objeto correspondente do arquivo `consultores.json`.

## Fluxo de Agendamento

### 1. Seleção de Consultor
- Usuário acessa a aplicação
- Seleciona seu nome na lista de consultores
- Clica em "Continuar"

### 2. Preenchimento do Formulário
- Preenche modelo do veículo
- Preenche cor do veículo
- Preenche placa do veículo
- Clica em "Registrar Agendamento"

### 3. Notificação Telegram
- Sistema envia mensagem automática ao higienizador
- Mensagem contém todos os dados do agendamento
- Higienizador pode clicar em "✅ Confirmar Serviço" ou "❌ Recusar"

### 4. Confirmação por E-mail
- Ao confirmar no Telegram, consultor recebe e-mail
- E-mail contém todos os detalhes do agendamento
- Status muda para "Confirmado"

## Testes

### Executar Testes Unitários

```bash
pnpm test
```

### Testes Inclusos

- **agendamentos.test.ts**: Testes de criação, atualização e listagem de agendamentos
- **types.test.ts**: Validação de schemas Zod

## Desenvolvimento

### Iniciar Servidor

```bash
pnpm dev
```

O servidor rodará em `http://localhost:3000`

### Build para Produção

```bash
pnpm build
pnpm start
```

## Troubleshooting

### Erro: "Bot token não configurado"

Certifique-se de que `TELEGRAM_BOT_TOKEN` está definido nas variáveis de ambiente.

### Erro: "Chat ID não configurado"

Defina `TELEGRAM_CLEANER_CHAT_ID` com o ID da conversa do Telegram.

### E-mails não chegam

1. Verifique credenciais SMTP
2. Confirme que o endereço de e-mail está correto
3. Verifique pasta de spam
4. Para Gmail, use App Password em vez de senha normal

### Agendamento não aparece no Telegram

1. Confirme que o bot foi iniciado corretamente
2. Verifique logs do servidor
3. Teste o bot manualmente enviando uma mensagem para ele

## Segurança

- Nunca commit `.env` com credenciais reais
- Use variáveis de ambiente para todas as credenciais
- Implemente rate limiting em produção
- Valide e sanitize todos os inputs do usuário
- Use HTTPS em produção

## Suporte

Para problemas ou dúvidas, consulte os logs do servidor:

```bash
tail -f .manus-logs/devserver.log
```

## Próximas Melhorias

- Integração com banco de dados para persistência
- Dashboard de administração
- Relatórios de agendamentos
- Notificações por SMS
- Integração com calendário
- Sistema de feedback do cliente
