/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

import { z } from "zod";

export type * from "../drizzle/schema";
export * from "./_core/errors";

// Schemas de validação para agendamentos
export const AgendamentoSchema = z.object({
  id: z.string(),
  consultorId: z.string(),
  nomeConsultor: z.string(),
  emailConsultor: z.string().email(),
  modeloVeiculo: z.string().min(1, "Modelo do veículo é obrigatório"),
  corVeiculo: z.string().min(1, "Cor do veículo é obrigatória"),
  placaVeiculo: z.string().min(1, "Placa do veículo é obrigatória"),
  dataAgendamento: z.number(),
  status: z.enum(["pendente", "confirmado", "concluido"]),
  callbackId: z.string().optional(),
});

export type Agendamento = z.infer<typeof AgendamentoSchema>;

export const RegistroAgendamentoSchema = z.object({
  consultorId: z.string().min(1, "Consultor é obrigatório"),
  modeloVeiculo: z.string().min(1, "Modelo do veículo é obrigatório"),
  corVeiculo: z.string().min(1, "Cor do veículo é obrigatória"),
  placaVeiculo: z.string().min(1, "Placa do veículo é obrigatória"),
});

export type RegistroAgendamento = z.infer<typeof RegistroAgendamentoSchema>;

export const ConsultorSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string().email(),
});

export type ConsultorType = z.infer<typeof ConsultorSchema>;
