import nodemailer from "nodemailer";
import { Agendamento } from "@shared/types";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || "";


let transporter: nodemailer.Transporter | null = null;

export async function initEmailService() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.warn("[Email] Configuração SMTP incompleta");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

   try {
    await transporter.verify(); // 🔥 TESTE REAL SMTP
    console.log("[Email] SMTP conectado com sucesso");
  } catch (error) {
    console.error("[Email] Falha na conexão SMTP:", error);
  }

  console.log("[Email] Serviço de e-mail inicializado");
  return transporter;
  
}

export async function getEmailTransporter() {
  if (!transporter) {
    transporter = await initEmailService();
  }
  return transporter;
}

export async function sendConfirmationEmail(
  agendamento: Agendamento
): Promise<boolean> {
  try {
    const transporter = await getEmailTransporter();
    if (!transporter) {
      console.warn("[Email] Transporter não configurado");
      return false;
    }

    const htmlContent = generateConfirmationEmailHTML(agendamento);

    const mailOptions = {
      from: SMTP_FROM_EMAIL,
      to: agendamento.emailConsultor,
      subject: `Confirmação de Agendamento - ${agendamento.placaVeiculo}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] E-mail de confirmação enviado para ${agendamento.emailConsultor}`);
    return true;
  } catch (error) {
    console.error("[Email] Erro ao enviar e-mail:", error);
    return false;
  }
}

export async function sendServiceConfirmedEmail(
  agendamento: Agendamento
): Promise<boolean> {
  try {
    const transporter = await getEmailTransporter();
    if (!transporter) {
      console.warn("[Email] Transporter não configurado");
      return false;
    }

    const htmlContent = generateServiceConfirmedEmailHTML(agendamento);

    const mailOptions = {
      from: SMTP_FROM_EMAIL,
      to: agendamento.emailConsultor,
      subject: `Serviço Confirmado - ${agendamento.placaVeiculo}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] E-mail de confirmação de serviço enviado para ${agendamento.emailConsultor}`);
    return true;
  } catch (error) {
    console.error("[Email] Erro ao enviar e-mail:", error);
    return false;
  }
}

function generateConfirmationEmailHTML(agendamento: Agendamento): string {
  const dataFormatada = new Date(agendamento.dataAgendamento).toLocaleString("pt-BR");

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de Agendamento</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
        }
        .info-section {
          margin-bottom: 25px;
        }
        .info-section h3 {
          color: #667eea;
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #555;
        }
        .info-value {
          color: #333;
        }
        .status-badge {
          display: inline-block;
          background-color: #fff3cd;
          color: #856404;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 15px;
        }
        .footer {
          background-color: #f9f9f9;
          padding: 20px 30px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Agendamento Registrado</h1>
        </div>
        
        <div class="content">
          <p>Olá <strong>${agendamento.nomeConsultor}</strong>,</p>
          
          <p>Seu agendamento de higienização foi registrado com sucesso! O higienizador será notificado e entrará em contato para confirmar.</p>
          
          <div class="info-section">
            <h3>Dados do Veículo</h3>
            <div class="info-item">
              <span class="info-label">Modelo:</span>
              <span class="info-value">${agendamento.modeloVeiculo}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Cor:</span>
              <span class="info-value">${agendamento.corVeiculo}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Placa:</span>
              <span class="info-value">${agendamento.placaVeiculo}</span>
            </div>
          </div>
          
          <div class="info-section">
            <h3>Informações do Agendamento</h3>
            <div class="info-item">
              <span class="info-label">ID:</span>
              <span class="info-value">${agendamento.id}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data/Hora:</span>
              <span class="info-value">${dataFormatada}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value">${agendamento.status === "pendente" ? "Pendente de Confirmação" : "Confirmado"}</span>
            </div>
          </div>
          
          <div class="status-badge">
            ⏳ Aguardando confirmação do higienizador
          </div>
        </div>
        
        <div class="footer">
          <p>Este é um e-mail automático. Por favor, não responda.</p>
          <p>&copy; 2026 Sistema de Higienização de Veículos. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateServiceConfirmedEmailHTML(agendamento: Agendamento): string {
  const dataFormatada = new Date(agendamento.dataAgendamento).toLocaleString("pt-BR");

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Serviço Confirmado</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
        }
        .info-section {
          margin-bottom: 25px;
        }
        .info-section h3 {
          color: #10b981;
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #555;
        }
        .info-value {
          color: #333;
        }
        .status-badge {
          display: inline-block;
          background-color: #d1fae5;
          color: #065f46;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 15px;
        }
        .footer {
          background-color: #f9f9f9;
          padding: 20px 30px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Serviço Confirmado!</h1>
        </div>
        
        <div class="content">
          <p>Olá <strong>${agendamento.nomeConsultor}</strong>,</p>
          
          <p>Ótimas notícias! O higienizador confirmou o agendamento e o serviço de higienização foi aprovado.</p>
          
          <div class="info-section">
            <h3>Dados do Veículo</h3>
            <div class="info-item">
              <span class="info-label">Modelo:</span>
              <span class="info-value">${agendamento.modeloVeiculo}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Cor:</span>
              <span class="info-value">${agendamento.corVeiculo}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Placa:</span>
              <span class="info-value">${agendamento.placaVeiculo}</span>
            </div>
          </div>
          
          <div class="info-section">
            <h3>Informações do Agendamento</h3>
            <div class="info-item">
              <span class="info-label">ID:</span>
              <span class="info-value">${agendamento.id}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data/Hora:</span>
              <span class="info-value">${dataFormatada}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value">Confirmado</span>
            </div>
          </div>
          
          <div class="status-badge">
            ✓ Serviço aprovado e confirmado
          </div>
          
          <p style="margin-top: 25px; color: #666;">
            O higienizador entrará em contato em breve para agendar a data e hora da higienização.
          </p>
        </div>
        
        <div class="footer">
          <p>Este é um e-mail automático. Por favor, não responda.</p>
          <p>&copy; 2026 Sistema de Higienização de Veículos. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
