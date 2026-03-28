import { Agendamento, RegistroAgendamento } from "@shared/types";
import { getConsultorById } from "./consultores";
import { v4 as uuidv4 } from "uuid";

// Armazenamento em memória (sem banco de dados)
const agendamentosStore: Map<string, Agendamento> = new Map();

export function criarAgendamento(
  consultorId: string,
  dados: RegistroAgendamento
): Agendamento | null {
  const consultor = getConsultorById(consultorId);
  if (!consultor) {
    console.error(`[Agendamentos] Consultor ${consultorId} não encontrado`);
    return null;
  }

  const agendamento: Agendamento = {
    id: `agd-${uuidv4()}`,
    consultorId,
    nomeConsultor: consultor.nome,
    emailConsultor: consultor.email,
    modeloVeiculo: dados.modeloVeiculo,
    corVeiculo: dados.corVeiculo,
    placaVeiculo: dados.placaVeiculo,
    dataAgendamento: Date.now(),
    status: "pendente",
  };

  agendamentosStore.set(agendamento.id, agendamento);
  console.log(`[Agendamentos] Novo agendamento criado: ${agendamento.id}`);

  return agendamento;
}

export function getAgendamentoById(id: string): Agendamento | undefined {
  return agendamentosStore.get(id);
}

export function updateAgendamentoStatus(
  id: string,
  status: "pendente" | "confirmado" | "concluido"
): Agendamento | null {
  const agendamento = agendamentosStore.get(id);
  if (!agendamento) {
    console.error(`[Agendamentos] Agendamento ${id} não encontrado`);
    return null;
  }

  agendamento.status = status;
  agendamentosStore.set(id, agendamento);
  console.log(`[Agendamentos] Status do agendamento ${id} atualizado para ${status}`);

  return agendamento;
}

export function getAllAgendamentos(): Agendamento[] {
  return Array.from(agendamentosStore.values());
}

export function getAgendamentosByConsultor(consultorId: string): Agendamento[] {
  return Array.from(agendamentosStore.values()).filter(
    (a) => a.consultorId === consultorId
  );
}

export function deleteAgendamento(id: string): boolean {
  const deleted = agendamentosStore.delete(id);
  if (deleted) {
    console.log(`[Agendamentos] Agendamento ${id} deletado`);
  }
  return deleted;
}
