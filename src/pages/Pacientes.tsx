
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { validateCNS, formatCNS } from '@/utils/cnsValidation';
import { Patient } from '@/types';

const ITEMS_PER_PAGE = 10;

const Pacientes = () => {
  const [patients, setPatients] = useLocalStorage<Patient[]>('sismed-patients', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  const [formData, setFormData] = useState<Omit<Patient, 'id'>>({
    name: '',
    birthDate: '',
    cns: '',
    phone: '',
    address: ''
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cns.includes(searchTerm.replace(/\D/g, ''))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const resetForm = () => {
    setFormData({
      name: '',
      birthDate: '',
      cns: '',
      phone: '',
      address: ''
    });
    setEditingPatient(null);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      birthDate: patient.birthDate,
      cns: patient.cns,
      phone: patient.phone,
      address: patient.address
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      setPatients(patients.filter(p => p.id !== id));
      toast.success('Paciente excluído com sucesso!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate CNS
    if (!validateCNS(formData.cns)) {
      toast.error('CNS inválido. Deve ter 15 dígitos válidos.');
      return;
    }

    // Check for CNS uniqueness
    const existingPatient = patients.find(p => 
      p.cns === formData.cns && p.id !== editingPatient?.id
    );
    
    if (existingPatient) {
      toast.error('Já existe um paciente cadastrado com este CNS.');
      return;
    }

    // Convert name to uppercase
    const patientData = {
      ...formData,
      name: formData.name.toUpperCase()
    };

    if (editingPatient) {
      setPatients(patients.map(p => 
        p.id === editingPatient.id 
          ? { ...patientData, id: editingPatient.id }
          : p
      ));
      toast.success('Paciente atualizado com sucesso!');
    } else {
      const newPatient: Patient = {
        ...patientData,
        id: Date.now().toString()
      };
      setPatients([...patients, newPatient]);
      toast.success('Paciente cadastrado com sucesso!');
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, name: e.target.value.toUpperCase()});
  };

  return (
    <Layout>
      <div className="space-y-6 fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark">Gestão de Pacientes</h1>
            <p className="text-gray-600 mt-1">
              Cadastre e gerencie os pacientes do sistema
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="btn-modern"
                onClick={resetForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-dark">
                  {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Nome Completo *</Label>
                  <Input
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Data de Nascimento *</Label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">CNS (15 dígitos) *</Label>
                    <Input
                      value={formatCNS(formData.cns)}
                      onChange={(e) => setFormData({...formData, cns: e.target.value.replace(/\D/g, '')})}
                      placeholder="000 0000 0000 0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Telefone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(00) 00000-0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Endereço</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Rua, número, complemento"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="btn-modern">
                    {editingPatient ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="glass-panel">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou CNS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Patients Table */}
        <div className="glass-panel">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-dark">
              Pacientes Cadastrados ({filteredPatients.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-white/50">
                  <th className="bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-dark border-b border-gray-200">Nome</th>
                  <th className="bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-dark border-b border-gray-200">CNS</th>
                  <th className="bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-dark border-b border-gray-200">Idade</th>
                  <th className="bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-dark border-b border-gray-200">Telefone</th>
                  <th className="bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-dark border-b border-gray-200">Endereço</th>
                  <th className="bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-dark border-b border-gray-200">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-primary/10 transition-colors duration-200 cursor-pointer">
                    <td className="px-4 py-3 text-sm border-b border-gray-100 font-medium text-dark">{patient.name}</td>
                    <td className="px-4 py-3 text-sm border-b border-gray-100 font-mono">{formatCNS(patient.cns)}</td>
                    <td className="px-4 py-3 text-sm border-b border-gray-100">{calculateAge(patient.birthDate)} anos</td>
                    <td className="px-4 py-3 text-sm border-b border-gray-100">{patient.phone || '-'}</td>
                    <td className="px-4 py-3 text-sm border-b border-gray-100">{patient.address || '-'}</td>
                    <td className="px-4 py-3 text-sm border-b border-gray-100">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(patient)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(patient.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1} a {Math.min(startIndex + ITEMS_PER_PAGE, filteredPatients.length)} de {filteredPatients.length} pacientes
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Pacientes;
