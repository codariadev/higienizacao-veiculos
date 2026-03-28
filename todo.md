# Sistema de Agendamento de Higienização de Veículos - TODO

## Funcionalidades Principais

### Fase 1: Estrutura e Dependências
- [x] Configurar dependências para Telegram Bot API
- [x] Configurar dependências para envio de e-mail
- [x] Adicionar bibliotecas de validação e utilitários

### Fase 2: Sistema de Consultores
- [x] Criar arquivo de configuração de consultores (consultores.json)
- [x] Implementar função de leitura de consultores do arquivo
- [x] Criar API para listar consultores disponíveis

### Fase 3: Interface de Agendamento
- [x] Criar página de login/seleção de consultor elegante
- [x] Criar formulário de agendamento com validação
- [x] Implementar validação de campos obrigatórios (nome, modelo, cor, placa)
- [x] Adicionar estilos elegantes e responsivos
- [x] Implementar feedback visual de sucesso/erro

### Fase 4: Integração Telegram
- [x] Configurar credenciais do bot Telegram
- [x] Implementar API route para registro de agendamento
- [x] Implementar envio de mensagem ao Telegram com dados do agendamento
- [x] Adicionar botão inline de confirmação na mensagem Telegram
- [x] Testes de envio de mensagens

### Fase 5: Webhook Telegram
- [x] Implementar endpoint webhook para callbacks do Telegram
- [x] Processar callback de confirmação do higienizador
- [x] Validar e tratar erros de callback

### Fase 6: Sistema de E-mails
- [x] Configurar serviço de envio de e-mail
- [x] Criar template de e-mail de confirmação
- [x] Implementar envio de e-mail ao consultor após confirmação
- [x] Incluir todos os detalhes do agendamento no e-mail
- [x] Testes de envio de e-mails

### Fase 7: Testes e Validações
- [x] Testes unitários das funções principais
- [x] Testes de integração do fluxo completo
- [x] Validações básicas (campos obrigatórios, schemas Zod)

### Fase 8: Documentação e Entrega
- [x] Documentação de configuração (SETUP.md)
- [x] Instruções de uso (README.md)
- [x] Guia de setup do bot Telegram (em SETUP.md)
- [x] Guia de configuração de e-mail (em SETUP.md)

## Estrutura de Dados

### Consultor
- id: string
- nome: string
- email: string (corporativo)

### Agendamento
- id: string (gerado)
- consultorId: string
- nomeConsultor: string
- modeloVeiculo: string
- corVeiculo: string
- placaVeiculo: string
- dataAgendamento: timestamp
- status: 'pendente' | 'confirmado' | 'concluido'

## Variáveis de Ambiente Necessárias
- TELEGRAM_BOT_TOKEN
- TELEGRAM_CLEANER_CHAT_ID
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASSWORD
- SMTP_FROM_EMAIL


## Roadmap de Melhorias (Versões Futuras)

Segurança e Qualidade:
- Implementar validação obrigatória de TELEGRAM_BOT_TOKEN e TELEGRAM_CLEANER_CHAT_ID
- Criar testes automatizados para telegram.ts com mocks da API
- Criar testes automatizados para email.ts com mocks do transporter
- Adicionar validação/autenticação do webhook Telegram com secret token
- Adicionar logging estruturado para auditoria
- Implementar rate limiting para APIs

Funcionalidades:
- Integração com banco de dados para persistência
- Dashboard de administração
- Relatórios de agendamentos
- Notificações por SMS
- Integração com calendário
