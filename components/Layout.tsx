import React from 'react';
import { LayoutDashboard, Settings, Activity, FileText, LogOut, Menu, User, Droplets, Zap, Flame } from 'lucide-react';
import { ProcessArea, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  activeTab: string;
  onNavigate: (tab: any) => void;
  onLogout: () => void;
  selectedProcess: ProcessArea | 'General';
  onSelectProcess: (p: ProcessArea | 'General') => void;
}

interface ProcessTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children, userRole, activeTab, onNavigate, onLogout, selectedProcess, onSelectProcess
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ id, icon: Icon, label }: { id: string; icon: any; label: string }) => (
    <button
      onClick={() => {
        onNavigate(id);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 mb-2 rounded-xl transition-all duration-200 group ${activeTab === id
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${activeTab === id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F3F4F8] overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 flex items-center justify-center border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img src="/elis_logo.png" alt="Elis Logo" className="h-10 w-auto object-contain" />
              <div className="h-8 w-px bg-slate-200 mx-1"></div>
              <div className="flex flex-col justify-center">
                <span className="text-lg font-bold text-slate-800 leading-none tracking-tight">KP-IA</span>
                <span className="text-[10px] text-slate-400 font-medium leading-none mt-1">Planta Nájera</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="mb-6">
              <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Principal</p>
              <NavItem id="dashboard" icon={LayoutDashboard} label="Tablero" />
              <NavItem id="reports" icon={FileText} label="Análisis" />
            </div>

            {userRole !== UserRole.OPERATOR && (
              <div className="mb-6">
                <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sistema</p>
                <NavItem id="settings" icon={Settings} label="Configuración" />
              </div>
            )}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center p-3 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User size={20} />
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 truncate">{userRole}</p>
                <p className="text-xs text-slate-500 truncate">En línea</p>
              </div>
              <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 sticky top-0">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center space-x-4 overflow-x-auto pb-1 md:pb-0 hide-scrollbar w-full md:w-auto">
              <ProcessTab
                label="General"
                isActive={selectedProcess === 'General'}
                onClick={() => onSelectProcess('General')}
              />
              {Object.values(ProcessArea).map((area) => (
                <ProcessTab
                  key={area}
                  label={area}
                  isActive={selectedProcess === area}
                  onClick={() => onSelectProcess(area)}
                />
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium border border-green-200">
                <Activity size={12} className="mr-1" /> Sistema en Vivo
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const ProcessTab: React.FC<ProcessTabProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
            whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${isActive
        ? 'bg-slate-900 text-white shadow-md'
        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}
        `}
  >
    {label}
  </button>
)

export default Layout;