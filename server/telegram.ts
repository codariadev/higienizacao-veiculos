import { Telegraf } from "telegraf";
import { Agendamento } from "@shared/types";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CLEANER_CHAT_ID = process.env.TELEGRAM_CLEANER_CHAT_ID || "";

let bot: Telegraf | null = null;

export function initTelegramBot() {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log("[Telegram] Bot token não configurado");
    return null;
  }

  bot = new Telegraf(TELEGRAM_BOT_TOKEN);
  console.log("[Telegram] Bot inicializado");
  return bot;
}

export function getTelegramBot() {
  if (!bot) {
    bot = initTelegramBot();
  }
  return bot;
}

export async function sendAgendamentoNotification(
  agendamento: Agendamento
): Promise<boolean> {
  try {
    const bot = getTelegramBot();
    if (!bot || !TELEGRAM_CLEANER_CHAT_ID) {
      console.warn("[Telegram] Bot ou Chat ID não configurado");
      return false;
    }

    const message = `
📋 *Novo Agendamento de Higienização*

👤 *Consultor:* ${agendamento.nomeConsultor}
📧 *Email:* ${agendamento.emailConsultor}

🚗 *Veículo:*
   • Modelo: ${agendamento.modeloVeiculo}
   • Cor: ${agendamento.corVeiculo}
   • Placa: ${agendamento.placaVeiculo}

⏰ *Data/Hora:* ${new Date(agendamento.dataAgendamento).toLocaleString("pt-BR")}

ID do Agendamento: \`${agendamento.id}\`
    `.trim();

    await bot.telegram.sendMessage(TELEGRAM_CLEANER_CHAT_ID, message, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "✅ Confirmar Serviço",
              callback_data: `confirm_${agendamento.id}`,
            },
          ],
          [
            {
              text: "❌ Recusar",
              callback_data: `reject_${agendamento.id}`,
            },
          ],
        ],
      },
    });

    console.log(`[Telegram] Notificação enviada para agendamento ${agendamento.id}`);
    return true;
  } catch (error) {
    console.error("[Telegram] Erro ao enviar notificação:", error);
    return false;
  }
}

export async function sendConfirmationMessage(
  chatId: string,
  message: string
): Promise<boolean> {
  try {
    const bot = getTelegramBot();
    if (!bot) {
      console.warn("[Telegram] Bot não inicializado");
      return false;
    }

    await bot.telegram.sendMessage(chatId, message, {
      parse_mode: "Markdown",
    });

    console.log(`[Telegram] Mensagem enviada para ${chatId}`);
    return true;
  } catch (error) {
    console.error("[Telegram] Erro ao enviar mensagem:", error);
    return false;
  }
}

export function setupCallbackHandler(
  callback: (callbackId: string, action: "confirm" | "reject") => Promise<void>
) {
  const bot = getTelegramBot();
  if (!bot) {
    console.warn("[Telegram] Bot não inicializado para callbacks");
    return;
  }

  bot.action(/^(confirm|reject)_(.+)$/, async (ctx) => {
    try {
      const action = ctx.match[1] as "confirm" | "reject";
      const agendamentoId = ctx.match[2];

      await callback(agendamentoId, action);

      const message =
        action === "confirm"
          ? "✅ Agendamento confirmado com sucesso!"
          : "❌ Agendamento recusado.";

      await ctx.answerCbQuery(message, { show_alert: true });
      await ctx.editMessageReplyMarkup(undefined);
    } catch (error) {
      console.error("[Telegram] Erro ao processar callback:", error);
      await ctx.answerCbQuery("Erro ao processar ação", { show_alert: true });
    }
  });

  console.log("[Telegram] Handler de callbacks configurado");
}

export async function startBot() {
  const bot = getTelegramBot();
  if (!bot) {
    console.warn("[Telegram] Não é possível iniciar bot sem token");
    return;
  }

  try {
    await bot.launch();
    console.log("[Telegram] Bot iniciado com sucesso");
  } catch (error) {
    console.error("[Telegram] Erro ao iniciar bot:", error);
  }
}

export async function stopBot() {
  const bot = getTelegramBot();
  if (!bot) return;

  try {
    await bot.stop();
    console.log("[Telegram] Bot parado");
  } catch (error) {
    console.error("[Telegram] Erro ao parar bot:", error);
  }
}
