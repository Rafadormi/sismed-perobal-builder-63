
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Pill, FileText, Plus, FileCheck, ClipboardCheck } from "lucide-react";
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
      title: "Novo Paciente",
      icon: Users,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => navigate("/pacientes")
    },
    {
      title: "Nova Receita",
      icon: FileText,
      color: "bg-green-500 hover:bg-green-600",
      action: () => navigate("/receitas")
    },
    {
      title: "Novo Atestado",
      icon: FileCheck,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => navigate("/atestados")
    },
    {
      title: "Comparecimento",
      icon: ClipboardCheck,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => navigate("/comparecimentos")
    }
  ];

  const stats = [
    { label: "Pacientes", value: patients.length, color: "text-blue-600" },
    { label: "Medicamentos", value: medications.length, color: "text-green-600" },
    { label: "Receitas", value: prescriptions.length, color: "text-orange-600" }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SISMED Perobal v4.0
          </h1>
          <p className="text-gray-600">
            Sistema Integrado de Saúde Municipal
          </p>
        </div>

        {/* Stats - Simplified */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions - Grid Layout */}
        <Card className="bg-white border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white h-16 flex items-center justify-center gap-3 text-base font-medium`}
                >
                  <action.icon className="h-5 w-5" />
                  {action.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
