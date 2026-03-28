import fs from "fs";
import path from "path";

export interface Consultor {
  id: string;
  nome: string;
  email: string;
}

const CONSULTORES_FILE = path.join(process.cwd(), "consultores.json");

export function loadConsultores(): Consultor[] {
  try {
    if (!fs.existsSync(CONSULTORES_FILE)) {
      console.warn("[Consultores] Arquivo consultores.json não encontrado");
      return [];
    }
    const data = fs.readFileSync(CONSULTORES_FILE, "utf-8");
    return JSON.parse(data) as Consultor[];
  } catch (error) {
    console.error("[Consultores] Erro ao carregar consultores:", error);
    return [];
  }
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

export function addConsultor(consultor: Consultor): void {
  const consultores = loadConsultores();
  const exists = consultores.find((c) => c.id === consultor.id);
  if (exists) {
    throw new Error(`Consultor com ID ${consultor.id} já existe`);
  }
  consultores.push(consultor);
  fs.writeFileSync(CONSULTORES_FILE, JSON.stringify(consultores, null, 2));
}

export function updateConsultor(id: string, updates: Partial<Consultor>): void {
  const consultores = loadConsultores();
  const index = consultores.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Consultor com ID ${id} não encontrado`);
  }
  consultores[index] = { ...consultores[index], ...updates };
  fs.writeFileSync(CONSULTORES_FILE, JSON.stringify(consultores, null, 2));
}

export function deleteConsultor(id: string): void {
  const consultores = loadConsultores();
  const filtered = consultores.filter((c) => c.id !== id);
  if (filtered.length === consultores.length) {
    throw new Error(`Consultor com ID ${id} não encontrado`);
  }
  fs.writeFileSync(CONSULTORES_FILE, JSON.stringify(filtered, null, 2));
}
