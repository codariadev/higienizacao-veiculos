import { describe, it, expect, beforeEach } from "vitest";
import {
  criarAgendamento,
  getAgendamentoById,
  updateAgendamentoStatus,
  getAllAgendamentos,
  getAgendamentosByConsultor,
  deleteAgendamento,
} from "./agendamentos";
import type { RegistroAgendamento } from "../shared/types";

describe("Agendamentos Service", () => {
  beforeEach(() => {
    // Limpar store antes de cada teste
    const agendamentos = getAllAgendamentos();
    agendamentos.forEach((a) => deleteAgendamento(a.id));
  });

  it("deve criar um novo agendamento", () => {
    const dados: RegistroAgendamento = {
      consultorId: "cons-001",
      modeloVeiculo: "Honda Civic",
      corVeiculo: "Preto",
      placaVeiculo: "ABC-1234",
    };

    const agendamento = criarAgendamento("cons-001", dados);

    expect(agendamento).toBeDefined();
    expect(agendamento?.nomeConsultor).toBe("João Silva");
    expect(agendamento?.emailConsultor).toBe("joao.silva@empresa.com");
    expect(agendamento?.modeloVeiculo).toBe("Honda Civic");
    expect(agendamento?.status).toBe("pendente");
  });

  it("deve retornar null ao criar agendamento com consultor inválido", () => {
    const dados: RegistroAgendamento = {
      consultorId: "cons-invalid",
      modeloVeiculo: "Honda Civic",
      corVeiculo: "Preto",
      placaVeiculo: "ABC-1234",
    };

    const agendamento = criarAgendamento("cons-invalid", dados);

    expect(agendamento).toBeNull();
  });

  it("deve recuperar agendamento por ID", () => {
    const dados: RegistroAgendamento = {
      consultorId: "cons-001",
      modeloVeiculo: "Honda Civic",
      corVeiculo: "Preto",
      placaVeiculo: "ABC-1234",
    };

    const created = criarAgendamento("cons-001", dados);
    expect(created).toBeDefined();

    const retrieved = getAgendamentoById(created!.id);

    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(created?.id);
    expect(retrieved?.placaVeiculo).toBe("ABC-1234");
  });

  it("deve atualizar status do agendamento", () => {
    const dados: RegistroAgendamento = {
      consultorId: "cons-001",
      modeloVeiculo: "Honda Civic",
      corVeiculo: "Preto",
      placaVeiculo: "ABC-1234",
    };

    const created = criarAgendamento("cons-001", dados);
    expect(created?.status).toBe("pendente");

    const updated = updateAgendamentoStatus(created!.id, "confirmado");

    expect(updated?.status).toBe("confirmado");
    expect(updated?.id).toBe(created?.id);
  });

  it("deve listar todos os agendamentos", () => {
    const dados1: RegistroAgendamento = {
      consultorId: "cons-001",
      modeloVeiculo: "Honda Civic",
      corVeiculo: "Preto",
      placaVeiculo: "ABC-1234",
    };

    const dados2: RegistroAgendamento = {
      consultorId: "cons-002",
      modeloVeiculo: "Toyota Corolla",
      corVeiculo: "Branco",
      placaVeiculo: "XYZ-5678",
    };

    criarAgendamento("cons-001", dados1);
    criarAgendamento("cons-002", dados2);

    const all = getAllAgendamentos();

    expect(all).toHaveLength(2);
  });

  it("deve listar agendamentos por consultor", () => {
    const dados1: RegistroAgendamento = {
      consultorId: "cons-001",
      modeloVeiculo: "Honda Civic",
      corVeiculo: "Preto",
      placaVeiculo: "ABC-1234",
    };

    const dados2: RegistroAgendamento = {
      consultorId: "cons-001",
      modeloVeiculo: "Toyota Corolla",
      corVeiculo: "Branco",
      placaVeiculo: "XYZ-5678",
    };

    const dados3: RegistroAgendamento = {
      consultorId: "cons-002",
      modeloVeiculo: "Ford Focus",
      corVeiculo: "Azul",
      placaVeiculo: "DEF-9012",
    };

    criarAgendamento("cons-001", dados1);
    criarAgendamento("cons-001", dados2);
    criarAgendamento("cons-002", dados3);

    const byConsultor = getAgendamentosByConsultor("cons-001");

    expect(byConsultor).toHaveLength(2);
    expect(byConsultor.every((a) => a.consultorId === "cons-001")).toBe(true);
  });

  it("deve deletar um agendamento", () => {
    const dados: RegistroAgendamento = {
      consultorId: "cons-001",
      modeloVeiculo: "Honda Civic",
      corVeiculo: "Preto",
      placaVeiculo: "ABC-1234",
    };

    const created = criarAgendamento("cons-001", dados);
    expect(created).toBeDefined();

    const deleted = deleteAgendamento(created!.id);

    expect(deleted).toBe(true);
    expect(getAgendamentoById(created!.id)).toBeUndefined();
  });

  it("deve retornar false ao deletar agendamento inexistente", () => {
    const deleted = deleteAgendamento("agd-inexistente");

    expect(deleted).toBe(false);
  });
});
