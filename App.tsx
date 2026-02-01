import React, { useState } from 'react';
import { UserRole, ProcessArea } from './types';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ConfigPanel from './pages/ConfigPanel';
import ReportsAnalysis from './pages/ReportsAnalysis';

const App: React.FC = () => {
  // Simple Auth State
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'reports'>('dashboard');
  const [selectedProcess, setSelectedProcess] = useState<ProcessArea | 'General'>('General');

  // Simple Login Component inline for simplicity
  if (!userRole) {
    return (
      <div className="min-h-screen bg-[#F3F4F8] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md animate-fade-in border border-white/50">
          <div className="text-center mb-10">
            {/* Logo de Elis */}
            <div className="mb-6 flex justify-center">
                <img src="/elis_logo.png" alt="Elis Logo" className="h-20 w-auto object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Planta Nájera</h1>
            <p className="text-slate-500 mt-2">Ingreso al Sistema de Productividad KP-IA</p>
          </div>
          
          <div className="space-y-3">
            <button 
                onClick={() => setUserRole(UserRole.ADMIN)}
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group"
            >
                <div className="text-left">
                    <p className="font-bold text-slate-800">Administrador</p>
                    <p className="text-xs text-slate-500">Acceso Total</p>
                </div>
                <span className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors"></span>
            </button>

            <button 
                onClick={() => setUserRole(UserRole.MAINTENANCE)}
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all flex items-center justify-between group"
            >
                <div className="text-left">
                    <p className="font-bold text-slate-800">Mantenimiento</p>
                    <p className="text-xs text-slate-500">Acceso Config</p>
                </div>
                <span className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-amber-500 transition-colors"></span>
            </button>

            <button 
                onClick={() => setUserRole(UserRole.OPERATOR)}
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-between group"
            >
                 <div className="text-left">
                    <p className="font-bold text-slate-800">Operario</p>
                    <p className="text-xs text-slate-500">Solo Lectura</p>
                </div>
                <span className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-emerald-500 transition-colors"></span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">KP-IA v1.0.0 | Modo Simulador</p>
        </div>
      </div>
    );
  }

  return (
    <Layout
      userRole={userRole}
      activeTab={activeTab}
      onNavigate={setActiveTab}
      onLogout={() => setUserRole(null)}
      selectedProcess={selectedProcess}
      onSelectProcess={setSelectedProcess}
    >
      {activeTab === 'dashboard' && (
        <Dashboard selectedProcess={selectedProcess} />
      )}
      
      {activeTab === 'settings' && (
        <ConfigPanel />
      )}

      {activeTab === 'reports' && (
        <ReportsAnalysis />
      )}
    </Layout>
  );
};

export default App;