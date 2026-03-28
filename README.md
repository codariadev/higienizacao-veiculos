# Sistema de Agendamento de Higienização de Veículos

Um sistema elegante e completo para agendamento de higienização de veículos com integração Telegram e envio automático de e-mails.

## 🎯 Funcionalidades

- **Interface Elegante**: Design moderno e responsivo com gradientes sofisticados
- **Seleção de Consultor**: Consultores pré-cadastrados com autenticação simples
- **Formulário de Agendamento**: Validação de campos obrigatórios (modelo, cor, placa)
- **Integração Telegram**: Notificações automáticas ao higienizador com botão de confirmação
- **Confirmação por E-mail**: Templates personalizados com todos os detalhes do agendamento
- **Armazenamento em Memória**: Sem necessidade de banco de dados
- **Testes Automatizados**: Cobertura de testes unitários

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
cd higienizacao-veiculos
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Telegram
TELEGRAM_BOT_TOKEN=seu_token_aqui
TELEGRAM_CLEANER_CHAT_ID=seu_chat_id_aqui

# SMTP (E-mail)
SMTP_HOST=smtp.seu_provedor.com
SMTP_PORT=587
SMTP_USER=seu_email@empresa.com
SMTP_PASSWORD=sua_senha
SMTP_FROM_EMAIL=noreply@empresa.com
```

### 3. Iniciar o Servidor

```bash
pnpm dev
```

Acesse `http://localhost:3000` no navegador.

## 📋 Fluxo de Uso

1. **Selecione seu consultor** na lista
2. **Preencha os dados do veículo**:
   - Modelo (ex: Honda Civic)
   - Cor (ex: Preto)
   - Placa (ex: ABC-1234)
3. **Clique em "Registrar Agendamento"**
4. **Higienizador recebe notificação no Telegram** com botão de confirmação
5. **Ao confirmar, você recebe e-mail** de confirmação do serviço

## 🏗️ Arquitetura

```
┌─────────────────────┐
│  Consultor (Web)    │
│  Seleciona + Dados  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  API (tRPC)         │
│  Registra Agendamento
└──────────┬──────────┘
           │
      ┌────┴────┐
      │          │
      ▼          ▼
  ┌────────┐  ┌──────────┐
  │Telegram│  │E-mail    │
  │(Notif) │  │(Confirm) │
  └────────┘  └──────────┘
      │
      ▼
  ┌──────────────┐
  │Higienizador  │
  │Confirma      │
  └──────┬───────┘
         │
         ▼
  ┌──────────────────┐
  │Webhook Telegram  │
  │Processa Callback │
  └──────┬───────────┘
         │
         ▼
  ┌──────────────────┐
  │E-mail Final      │
  │Confirmação       │
  └──────────────────┘
```

## 📁 Estrutura do Projeto

```
higienizacao-veiculos/
├── consultores.json              # Consultores cadastrados
├── SETUP.md                      # Guia de configuração
├── README.md                     # Este arquivo
├── client/src/
│   ├── pages/
│   │   ├── Home.tsx             # Fluxo principal
│   │   ├── ConsultorSelect.tsx  # Seleção
│   │   └── AgendamentoForm.tsx  # Formulário
│   └── index.css                # Estilos
├── server/
│   ├── consultores.ts           # Gerenciamento
│   ├── agendamentos.ts          # Lógica
│   ├── telegram.ts              # Bot Telegram
│   ├── email.ts                 # Envio e-mail
│   ├── webhooks.ts              # Webhook
│   ├── routers.ts               # APIs
│   └── *.test.ts                # Testes
└── shared/
    └── types.ts                 # Tipos
```

## 🧪 Testes

Executar todos os testes:

```bash
pnpm test
```

Testes inclusos:

- **Agendamentos**: CRUD de agendamentos
- **Schemas**: Validação de dados com Zod

## 🎨 Design

O sistema utiliza um design elegante com:

- **Gradientes**: Azul → Roxo → Rosa
- **Tipografia**: Fonte Segoe UI moderna
- **Espaçamento**: Padding e margins consistentes
- **Sombras**: Efeito de elevação em cards
- **Responsividade**: Adaptado para mobile e desktop

## 🔧 Tecnologias

- **Frontend**: React 19, Tailwind CSS 4, TypeScript
- **Backend**: Express, tRPC, Node.js
- **Integração**: Telegraf (Telegram), Nodemailer (E-mail)
- **Validação**: Zod
- **Testes**: Vitest

## 📧 Configuração de E-mail

### Gmail

1. Ative 2FA na sua conta Google
2. Gere uma [App Password](https://myaccount.google.com/apppasswords)
3. Use a senha gerada em `SMTP_PASSWORD`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_app_password
```

### Outlook

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=seu_email@outlook.com
SMTP_PASSWORD=sua_senha
```

## 🤖 Configuração do Bot Telegram

1. Abra [@BotFather](https://t.me/botfather) no Telegram
2. Crie um novo bot com `/newbot`
3. Copie o token fornecido
4. Inicie uma conversa com o bot
5. Use [@userinfobot](https://t.me/userinfobot) para obter seu Chat ID

## 📝 Gerenciamento de Consultores

Edite `consultores.json`:

```json
[
  {
    "id": "cons-001",
    "nome": "João Silva",
    "email": "joao.silva@empresa.com"
  }
]
```

## 🚨 Troubleshooting

### Erro: Bot token não configurado
→ Defina `TELEGRAM_BOT_TOKEN` no `.env`

### Erro: Chat ID não configurado
→ Defina `TELEGRAM_CLEANER_CHAT_ID` no `.env`

### E-mails não chegam
→ Verifique credenciais SMTP e pasta de spam

### Agendamento não aparece no Telegram
→ Verifique logs: `tail -f .manus-logs/devserver.log`

## 📚 Documentação Adicional

Veja [SETUP.md](./SETUP.md) para guia completo de configuração.

## 📄 Licença

MIT

## 👨‍💻 Desenvolvimento

### Scripts Disponíveis

```bash
pnpm dev          # Iniciar servidor de desenvolvimento
pnpm build        # Build para produção
pnpm start        # Iniciar servidor de produção
pnpm test         # Executar testes
pnpm db:push      # Sincronizar banco de dados
```

## 🎯 Próximas Melhorias

- Integração com banco de dados
- Dashboard de administração
- Relatórios de agendamentos
- Notificações por SMS
- Integração com calendário
- Sistema de feedback

## 💬 Suporte

Para problemas ou sugestões, abra uma issue ou entre em contato.

---

**Desenvolvido com ❤️ para simplificar agendamentos de higienização**
