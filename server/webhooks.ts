import { Router, Request, Response } from "express";
import { getTelegramBot, setupCallbackHandler } from "./telegram";
import { getAgendamentoById, updateAgendamentoStatus } from "./agendamentos";
import { sendServiceConfirmedEmail } from "./email";

export function setupWebhooks(app: Router) {
  // Configurar handler de callbacks PRIMEIRO
  setupCallbackHandler(async (agendamentoId: string, action: "confirm" | "reject") => {
    try {
      if (action === "confirm") {
        const agendamento = getAgendamentoById(agendamentoId);
        if (!agendamento) {
          console.error(`[Webhook] Agendamento ${agendamentoId} não encontrado`);
          return;
        }

        // Atualizar status para confirmado
        const updated = updateAgendamentoStatus(agendamentoId, "confirmado");
        if (updated) {
          // Enviar e-mail de confirmação ao consultor
          await sendServiceConfirmedEmail(updated);
          console.log(`[Webhook] Agendamento ${agendamentoId} confirmado e e-mail enviado`);
        }
      } else if (action === "reject") {
        const agendamento = getAgendamentoById(agendamentoId);
        if (agendamento) {
          console.log(`[Webhook] Agendamento ${agendamentoId} recusado`);
        }
      }
    } catch (error) {
      console.error("[Webhook] Erro ao processar ação:", error);
    }
  });

  // DEPOIS registrar o endpoint webhook
  app.post("/webhooks/telegram/callback", async (req: Request, res: Response) => {
    try {
      const bot = getTelegramBot();
      if (!bot) {
        console.warn("[Webhook] Bot do Telegram não inicializado");
        return res.status(503).json({ error: "Bot não disponível" });
      }

      console.log("[Webhook] Update recebido do Telegram:", JSON.stringify(req.body, null, 2));

      // Processar update do Telegram
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error("[Webhook] Erro ao processar callback:", error);
      res.status(500).json({ error: "Erro ao processar callback" });
    }
  });

  console.log("[Webhooks] Webhooks configurados");
}
