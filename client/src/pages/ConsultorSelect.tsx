import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { ConsultorType } from "@shared/types";

interface ConsultorSelectProps {
  onSelect: (consultorId: string) => void;
}

export default function ConsultorSelect({ onSelect }: ConsultorSelectProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: consultores, isLoading } = trpc.consultores.list.useQuery();

  const handleSelect = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Agendamento de Higienização
          </h1>
          <p className="text-gray-600 text-lg">
            Selecione seu consultor para começar
          </p>
        </div>

        <div className="grid gap-4 mb-8">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando consultores...</p>
            </div>
          ) : consultores && consultores.length > 0 ? (
            consultores.map((consultor: ConsultorType) => (
              <Card
                key={consultor.id}
                className={`p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedId === consultor.id
                    ? "ring-2 ring-blue-500 bg-blue-50 shadow-lg"
                    : "hover:shadow-lg border-2 border-transparent"
                }`}
                onClick={() => setSelectedId(consultor.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {consultor.nome}
                      </h3>
                      <p className="text-sm text-gray-500">{consultor.email}</p>
                    </div>
                  </div>
                  {selectedId === consultor.id && (
                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum consultor disponível</p>
            </div>
          )}
        </div>

        <Button
          onClick={handleSelect}
          disabled={!selectedId}
          className="w-full button-primary text-white py-3 font-semibold"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
