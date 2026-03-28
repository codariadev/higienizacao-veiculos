import { z } from "zod";

export interface Consultor {
  id: string;
  nome: string;
  email: string;
}

const ConsultorSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string().email(),
});

// Cache em memória para evitar parse repetido
let consultoresCache: Consultor[] | null = null;

function parseConsultoresFromEnv(): Consultor[] {
  try {
    const consultoresJson = process.env.CONSULTORES_JSON;

    if (!consultoresJson) {
      console.warn("[Consultores] CONSULTORES_JSON não configurado");
      return [];
    }

    const parsed = JSON.parse(consultoresJson);
    const validados = z.array(ConsultorSchema).parse(parsed);

    console.log(`[Consultores] ${validados.length} consultores carregados do .env`);
    return validados;
  } catch (error) {
    console.error("[Consultores] Erro ao carregar consultores:", error);
    return [];
  }
}

export function loadConsultores(): Consultor[] {
  // Usar cache para não fazer parse toda vez
  if (consultoresCache === null) {
    consultoresCache = parseConsultoresFromEnv();
  }
  return consultoresCache;
}

export function getConsultorById(id: string): Consultor | undefined {
  const consultores = loadConsultores();
  return consultores.find((c) => c.id === id);
}

export function getConsultorByEmail(email: string): Consultor | undefined {
  const consultores = loadConsultores();
  return consultores.find((c) => c.email === email);
}

export function getAllConsultores(): Consultor[] {
  return loadConsultores();
}

// ⚠️ Funções de escrita desabilitadas (não é possível escrever em variáveis de ambiente)
export function addConsultor(consultor: Consultor): void {
  throw new Error(
    "Não é possível adicionar consultores em tempo de execução. " +
    "Atualize a variável CONSULTORES_JSON no .env ou no Vercel."
  );
}

export function updateConsultor(id: string, updates: Partial<Consultor>): void {
  throw new Error(
    "Não é possível atualizar consultores em tempo de execução. " +
    "Atualize a variável CONSULTORES_JSON no .env ou no Vercel."
  );
}

export function deleteConsultor(id: string): void {
  throw new Error(
    "Não é possível deletar consultores em tempo de execução. " +
    "Atualize a variável CONSULTORES_JSON no .env ou no Vercel."
  );
}
