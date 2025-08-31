
import React, { useState } from 'react';
import { Settings, Palette, Database, FileText, Monitor, Save, Download, Upload, Trash2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DesktopConfig {
  theme: 'light' | 'dark' | 'auto';
  institutionName: string;
  logoUrl: string;
  autoSave: boolean;
  windowStartMaximized: boolean;
  notifications: boolean;
  receitas: {
    templatePadrao: string;
    observacoesPadrao: string;
    validadeMeses: number;
    incluirCID: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupInterval: number;
    backupPath: string;
  };
}

const ConfiguracoesDesktop = () => {
  const [config, setConfig] = useLocalStorage<DesktopConfig>('sismed-desktop-config', {
    theme: 'light',
    institutionName: 'Secretaria Municipal de Saúde de Perobal',
    logoUrl: '/lovable-uploads/b954f439-274b-409b-9378-b06f8008eb70.png',
    autoSave: true,
    windowStartMaximized: true,
    notifications: true,
    receitas: {
      templatePadrao: 'Receita Médica Padrão',
      observacoesPadrao: 'Uso conforme orientação médica.',
      validadeMeses: 6,
      incluirCID: false,
    },
    backup: {
      autoBackup: true,
      backupInterval: 24,
      backupPath: 'Documents/SISMED/Backups',
    },
  });

  const [patients] = useLocalStorage('sismed-patients', []);
  const [medications] = useLocalStorage('sismed-medications', []);
  const [prescriptions] = useLocalStorage('sismed-prescriptions', []);

  const handleConfigChange = (section: keyof DesktopConfig, key: string, value: any) => {
    if (typeof config[section] === 'object' && config[section] !== null) {
      setConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section] as any,
          [key]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [section]: value as any
      }));
    }
    toast.success('Configuração salva');
  };

  const exportData = () => {
    const allData = {
      patients,
      medications, 
      prescriptions,
      config,
      exportDate: new Date().toISOString(),
      version: '4.0'
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sismed-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Backup exportado com sucesso!');
  };

  const clearAllData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      toast.success('Todos os dados foram removidos');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Configurações do Sistema
            </h1>
            <p className="text-gray-600 mt-1">
              Personalize o SISMED para sua unidade de saúde
            </p>
          </div>
          <Button onClick={() => toast.success('Configurações salvas!')} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Salvar Todas
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aparência */}
          <Card className="bg-white border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-blue-600" />
                Aparência e Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Tema do Sistema</Label>
                <Select 
                  value={config.theme} 
                  onValueChange={(value) => handleConfigChange('theme', '', value as DesktopConfig['theme'])}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="auto">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Nome da Instituição</Label>
                <Input
                  value={config.institutionName}
                  onChange={(e) => handleConfigChange('institutionName', '', e.target.value)}
                  placeholder="Nome da instituição"
                  className="border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Iniciar Maximizado</Label>
                  <p className="text-xs text-gray-500">Abrir aplicação em tela cheia</p>
                </div>
                <Switch
                  checked={config.windowStartMaximized}
                  onCheckedChange={(checked) => handleConfigChange('windowStartMaximized', '', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Receitas */}
          <Card className="bg-white border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Configurações de Receitas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Template Padrão</Label>
                <Input
                  value={config.receitas.templatePadrao}
                  onChange={(e) => handleConfigChange('receitas', 'templatePadrao', e.target.value)}
                  className="border-gray-300"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Observações Padrão</Label>
                <Textarea
                  value={config.receitas.observacoesPadrao}
                  onChange={(e) => handleConfigChange('receitas', 'observacoesPadrao', e.target.value)}
                  rows={3}
                  className="border-gray-300"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Validade Padrão (meses)</Label>
                <Select
                  value={config.receitas.validadeMeses.toString()}
                  onValueChange={(value) => handleConfigChange('receitas', 'validadeMeses', parseInt(value))}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 meses</SelectItem>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="12">12 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Incluir CID automaticamente</Label>
                  <p className="text-xs text-gray-500">Adicionar campo CID nas receitas</p>
                </div>
                <Switch
                  checked={config.receitas.incluirCID}
                  onCheckedChange={(checked) => handleConfigChange('receitas', 'incluirCID', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Backup e Dados */}
          <Card className="bg-white border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                Backup e Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Backup Automático</Label>
                  <p className="text-xs text-gray-500">Realizar backup automaticamente</p>
                </div>
                <Switch
                  checked={config.backup.autoBackup}
                  onCheckedChange={(checked) => handleConfigChange('backup', 'autoBackup', checked)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Intervalo de Backup (horas)</Label>
                <Select
                  value={config.backup.backupInterval.toString()}
                  onValueChange={(value) => handleConfigChange('backup', 'backupInterval', parseInt(value))}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="6">6 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button onClick={exportData} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>
                
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Dados
                </Button>

                <Button 
                  variant="destructive" 
                  onClick={clearAllData}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Todos os Dados
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card className="bg-white border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-gray-600" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Versão:</span>
                  <span className="font-mono">4.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Plataforma:</span>
                  <span className="font-mono">Desktop (Tauri)</span>
                </div>
                <div className="flex justify-between">
                  <span>Pacientes:</span>
                  <span className="font-mono">{patients.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medicamentos:</span>
                  <span className="font-mono">{medications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Receitas:</span>
                  <span className="font-mono">{prescriptions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Última Atualização:</span>
                  <span className="font-mono">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Notificações</Label>
                    <p className="text-xs text-gray-500">Exibir notificações do sistema</p>
                  </div>
                  <Switch
                    checked={config.notifications}
                    onCheckedChange={(checked) => handleConfigChange('notifications', '', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ConfiguracoesDesktop;
