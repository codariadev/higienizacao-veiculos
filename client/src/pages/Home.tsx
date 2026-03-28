import { useState } from "react";
import ConsultorSelect from "./ConsultorSelect";
import AgendamentoForm from "./AgendamentoForm";

type PageState = "select" | "form";

interface SelectedConsultor {
  id: string;
  nome: string;
  email: string;
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageState>("select");
  const [selectedConsultor, setSelectedConsultor] = useState<SelectedConsultor | null>(null);

  const handleConsultorSelect = (consultorId: string) => {
    // Temporary: Mock data until API is ready
    const mockConsultores = [
      { id: "cons-001", nome: "João Silva", email: "joao.silva@empresa.com" },
      { id: "cons-002", nome: "Maria Santos", email: "maria.santos@empresa.com" },
      { id: "cons-003", nome: "Pedro Oliveira", email: "pedro.oliveira@empresa.com" },
    ];

    const consultor = mockConsultores.find((c) => c.id === consultorId);
    if (consultor) {
      setSelectedConsultor(consultor);
      setCurrentPage("form");
    }
  };

  const handleBack = () => {
    setCurrentPage("select");
    setSelectedConsultor(null);
  };

  return (
    <>
      {currentPage === "select" ? (
        <ConsultorSelect onSelect={handleConsultorSelect} />
      ) : selectedConsultor ? (
        <AgendamentoForm
          consultorId={selectedConsultor.id}
          consultorNome={selectedConsultor.nome}
          consultorEmail={selectedConsultor.email}
          onBack={handleBack}
        />
      ) : null}
    </>
  );
}
