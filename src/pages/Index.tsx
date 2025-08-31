
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Users, Pill, FileText, FileCheck, ClipboardCheck, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Patient, Medication, Prescription } from "@/types";

const Index = () => {
  const navigate = useNavigate();
  const [patients] = useLocalStorage<Patient[]>('sismed-patients', []);
  const [medications] = useLocalStorage<Medication[]>('sismed-medications', []);
  const [prescriptions] = useLocalStorage<Prescription[]>('sismed-prescriptions', []);

  const quickActions = [
    {
      title: "Gerenciar Pacientes",
      subtitle: "Cadastrar e editar pacientes",
      icon: Users,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      action: () => navigate("/pacientes")
    },
    {
      title: "Medicamentos",
      subtitle: "Controle de medicamentos",
      icon: Pill,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      action: () => navigate("/medicamentos")
    },
    {
      title: "Nova Receita",
      subtitle: "Criar receitas médicas",
      icon: FileText,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      action: () => navigate("/receitas")
    },
    {
      title: "Atestados",
      subtitle: "Gerar atestados médicos",
      icon: FileCheck,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      action: () => navigate("/atestados")
    },
    {
      title: "Comparecimentos",
      subtitle: "Declarações de comparecimento",
      icon: ClipboardCheck,
      color: "bg-gradient-to-r from-cyan-500 to-cyan-600",
      action: () => navigate("/comparecimentos")
    },
    {
      title: "Configurações",
      subtitle: "Ajustes do sistema",
      icon: Settings,
      color: "bg-gradient-to-r from-gray-500 to-gray-600",
      action: () => navigate("/configuracoes")
    }
  ];

  const stats = [
    { label: "Pacientes Cadastrados", value: patients.length, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Medicamentos", value: medications.length, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Receitas Emitidas", value: prescriptions.length, color: "text-purple-600", bgColor: "bg-purple-50" }
  ];

  return (
    <Layout>
      <div className="space-y-8 fade-in">
        {/* Header */}
        <div className="text-center glass-panel">
          <h1 className="text-4xl font-bold text-dark mb-2">
            Sistema de Receitas Médicas
          </h1>
          <p className="text-lg text-gray-600">
            Prefeitura Municipal de Perobal
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`glass-panel card-hover text-center ${stat.bgColor}`}>
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-700">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="glass-panel">
          <h2 className="text-2xl font-semibold text-dark mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white h-24 flex flex-col items-center justify-center gap-2 text-base font-medium hover:scale-105 transition-all duration-300 shadow-lg`}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs opacity-90">{action.subtitle}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
