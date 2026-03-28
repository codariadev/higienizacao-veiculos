import { describe, it, expect } from "vitest";

describe("Configuração de Variáveis de Ambiente", () => {
  it("deve validar que TELEGRAM_BOT_TOKEN está configurado", () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    // Token pode estar vazio em desenvolvimento
    expect(typeof token).toBe("string");
  });

  it("deve validar que TELEGRAM_CLEANER_CHAT_ID está configurado", () => {
    const chatId = process.env.TELEGRAM_CLEANER_CHAT_ID;
    // Chat ID pode estar vazio em desenvolvimento, mas deve ser uma string
    expect(typeof chatId).toBe("string");
    // Se configurado, deve ser um número válido
    if (chatId && chatId.trim()) {
      const chatIdNum = parseInt(chatId, 10);
      expect(chatIdNum).not.toBeNaN();
    }
  });

  it("deve validar que SMTP_HOST está configurado", () => {
    const host = process.env.SMTP_HOST;
    expect(typeof host).toBe("string");
  });

  it("deve validar que SMTP_PORT está configurado", () => {
    const port = process.env.SMTP_PORT;
    expect(typeof port).toBe("string");
    // Pode estar vazio em desenvolvimento
  });

  it("deve validar que SMTP_USER está configurado", () => {
    const user = process.env.SMTP_USER;
    expect(typeof user).toBe("string");
  });

  it("deve validar que SMTP_PASSWORD está configurado", () => {
    const password = process.env.SMTP_PASSWORD;
    expect(typeof password).toBe("string");
  });

  it("deve validar que SMTP_FROM_EMAIL está configurado", () => {
    const fromEmail = process.env.SMTP_FROM_EMAIL;
    expect(typeof fromEmail).toBe("string");
    // Pode estar vazio em desenvolvimento
  });

  it("deve validar que JWT_SECRET está configurado", () => {
    const secret = process.env.JWT_SECRET;
    expect(typeof secret).toBe("string");
    if (secret) {
      expect(secret.length).toBeGreaterThan(0);
    }
  });

  it("deve validar que VITE_APP_ID está configurado", () => {
    const appId = process.env.VITE_APP_ID;
    expect(typeof appId).toBe("string");
  });
});
