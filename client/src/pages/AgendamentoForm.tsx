import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import type { RegistroAgendamento } from "@shared/types";

interface AgendamentoFormProps {
  consultorId: string;
  consultorNome: string;
  consultorEmail: string;
  onBack: () => void;
}

export default function AgendamentoForm({
  consultorId,
  consultorNome,
  consultorEmail,
  onBack,
}: AgendamentoFormProps) {
  const [formData, setFormData] = useState({
    modeloVeiculo: "",
    corVeiculo: "",
    placaVeiculo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const registrarMutation = trpc.agendamentos.registrar.useMutation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.modeloVeiculo.trim()) {
      toast.error("Modelo do veículo é obrigatório");
      return;
    }
    if (!formData.corVeiculo.trim()) {
      toast.error("Cor do veículo é obrigatória");
      return;
    }
    if (!formData.placaVeiculo.trim()) {
      toast.error("Placa do veículo é obrigatória");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: RegistroAgendamento = {
        consultorId,
        modeloVeiculo: formData.modeloVeiculo,
        corVeiculo: formData.corVeiculo,
        placaVeiculo: formData.placaVeiculo,
      };

      const result = await registrarMutation.mutateAsync(payload);

      if (result.success) {
        setSuccess(true);
        toast.success("Agendamento registrado com sucesso!");
        setTimeout(() => {
          setFormData({
            modeloVeiculo: "",
            corVeiculo: "",
            placaVeiculo: "",
          });
          setSuccess(false);
        }, 2000);
      } else {
        toast.error(result.error || "Erro ao registrar agendamento");
      }
    } catch (error) {
      toast.error("Erro ao registrar agendamento");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Agendamento Confirmado!
          </h2>
          <p className="text-gray-600 mb-4">
            Seu agendamento foi registrado com sucesso.
          </p>
          <p className="text-sm text-gray-500">
            O higienizador será notificado em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <Card className="p-8 card-elevated">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Novo Agendamento
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                ✓
              </div>
              <span>{consultorNome}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="modeloVeiculo" className="text-gray-700 font-semibold mb-2 block">
                Modelo do Veículo *
              </Label>
              <Input
                id="modeloVeiculo"
                name="modeloVeiculo"
                type="text"
                placeholder="Ex: Honda Civic"
                value={formData.modeloVeiculo}
                onChange={handleChange}
                className="input-elegant w-full"
              />
            </div>

            <div>
              <Label htmlFor="corVeiculo" className="text-gray-700 font-semibold mb-2 block">
                Cor do Veículo *
              </Label>
              <Input
                id="corVeiculo"
                name="corVeiculo"
                type="text"
                placeholder="Ex: Preto"
                value={formData.corVeiculo}
                onChange={handleChange}
                className="input-elegant w-full"
              />
            </div>

            <div>
              <Label htmlFor="placaVeiculo" className="text-gray-700 font-semibold mb-2 block">
                Placa do Veículo *
              </Label>
              <Input
                id="placaVeiculo"
                name="placaVeiculo"
                type="text"
                placeholder="Ex: ABC-1234"
                value={formData.placaVeiculo}
                onChange={handleChange}
                className="input-elegant w-full uppercase"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                O higienizador será notificado com os dados do seu agendamento e deverá confirmar o serviço.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 button-primary text-white font-semibold"
              >
                {isSubmitting ? "Registrando..." : "Registrar Agendamento"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
