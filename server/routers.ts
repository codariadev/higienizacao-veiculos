import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getAllConsultores } from "./consultores";
import { RegistroAgendamentoSchema } from "@shared/types";
import { criarAgendamento } from "./agendamentos";
import { sendAgendamentoNotification } from "./telegram";
import { sendConfirmationEmail } from "./email";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  consultores: router({
    list: publicProcedure.query(() => {
      return getAllConsultores();
    }),
  }),

  agendamentos: router({
    registrar: publicProcedure
      .input(RegistroAgendamentoSchema)
      .mutation(async ({ input }) => {
        try {
          const agendamento = criarAgendamento(input.consultorId, input);
          if (!agendamento) {
            return {
              success: false,
              error: "Falha ao criar agendamento",
            };
          }

          await sendAgendamentoNotification(agendamento);
          await sendConfirmationEmail(agendamento);

          return {
            success: true,
            agendamentoId: agendamento.id,
          };
        } catch (error) {
          console.error("[Agendamentos] Erro ao registrar:", error);
          return {
            success: false,
            error: "Erro ao registrar agendamento",
          };
        }
      }),
  })
});

export type AppRouter = typeof appRouter;
