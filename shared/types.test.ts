import { describe, it, expect } from "vitest";
import {
  RegistroAgendamentoSchema,
  ConsultorSchema,
  AgendamentoSchema,
} from "./types";

describe("Schemas de Validação", () => {
  describe("RegistroAgendamentoSchema", () => {
    it("deve validar dados corretos de agendamento", () => {
      const dados = {
        consultorId: "cons-001",
        modeloVeiculo: "Honda Civic",
        corVeiculo: "Preto",
        placaVeiculo: "ABC-1234",
      };

      const result = RegistroAgendamentoSchema.safeParse(dados);

      expect(result.success).toBe(true);
    });

    it("deve rejeitar agendamento sem consultorId", () => {
      const dados = {
        modeloVeiculo: "Honda Civic",
        corVeiculo: "Preto",
        placaVeiculo: "ABC-1234",
      };

      const result = RegistroAgendamentoSchema.safeParse(dados);

      expect(result.success).toBe(false);
    });

    it("deve rejeitar agendamento com campos vazios", () => {
      const dados = {
        consultorId: "cons-001",
        modeloVeiculo: "",
        corVeiculo: "Preto",
        placaVeiculo: "ABC-1234",
      };

      const result = RegistroAgendamentoSchema.safeParse(dados);

      expect(result.success).toBe(false);
    });
  });

  describe("ConsultorSchema", () => {
    it("deve validar dados corretos de consultor", () => {
      const consultor = {
        id: "cons-001",
        nome: "João Silva",
        email: "joao@empresa.com",
      };

      const result = ConsultorSchema.safeParse(consultor);

      expect(result.success).toBe(true);
    });

    it("deve rejeitar e-mail inválido", () => {
      const consultor = {
        id: "cons-001",
        nome: "João Silva",
        email: "email-invalido",
      };

      const result = ConsultorSchema.safeParse(consultor);

      expect(result.success).toBe(false);
    });
  });

  describe("AgendamentoSchema", () => {
    it("deve validar agendamento completo", () => {
      const agendamento = {
        id: "agd-123",
        consultorId: "cons-001",
        nomeConsultor: "João Silva",
        emailConsultor: "joao@empresa.com",
        modeloVeiculo: "Honda Civic",
        corVeiculo: "Preto",
        placaVeiculo: "ABC-1234",
        dataAgendamento: Date.now(),
        status: "pendente" as const,
      };

      const result = AgendamentoSchema.safeParse(agendamento);

      expect(result.success).toBe(true);
    });

    it("deve validar agendamento com status confirmado", () => {
      const agendamento = {
        id: "agd-123",
        consultorId: "cons-001",
        nomeConsultor: "João Silva",
        emailConsultor: "joao@empresa.com",
        modeloVeiculo: "Honda Civic",
        corVeiculo: "Preto",
        placaVeiculo: "ABC-1234",
        dataAgendamento: Date.now(),
        status: "confirmado" as const,
      };

      const result = AgendamentoSchema.safeParse(agendamento);

      expect(result.success).toBe(true);
    });

    it("deve rejeitar status inválido", () => {
      const agendamento = {
        id: "agd-123",
        consultorId: "cons-001",
        nomeConsultor: "João Silva",
        emailConsultor: "joao@empresa.com",
        modeloVeiculo: "Honda Civic",
        corVeiculo: "Preto",
        placaVeiculo: "ABC-1234",
        dataAgendamento: Date.now(),
        status: "invalido",
      };

      const result = AgendamentoSchema.safeParse(agendamento);

      expect(result.success).toBe(false);
    });
  });
});
