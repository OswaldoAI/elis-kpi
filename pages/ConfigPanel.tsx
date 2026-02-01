import React, { useState } from 'react';
import { ProcessArea, ProcessTargets } from '../types';
import { DEFAULT_TARGETS } from '../constants';
import { Save, RefreshCw } from 'lucide-react';

const ConfigPanel: React.FC = () => {
  const [targets, setTargets] = useState(DEFAULT_TARGETS);

  const handleChange = (area: ProcessArea, field: string, value: string) => {
    setTargets(prev => ({
      ...prev,
      [area]: {
        ...prev[area],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    alert("¡Configuración guardada exitosamente!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Configuración de Procesos</h2>
            <p className="text-slate-500">Establecer umbrales objetivo para cálculos de KPI.</p>
        </div>
        <button 
            onClick={handleSave}
            className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95"
        >
            <Save size={18} className="mr-2" /> Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(targets).map(([area, config]: [string, ProcessTargets]) => (
          <div key={area} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700">{area}</h3>
                <RefreshCw size={14} className="text-slate-400 cursor-pointer hover:text-blue-500" title="Restablecer valores predeterminados" />
            </div>
            
            <div className="p-6 space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 flex justify-between">
                        OEE Objetivo (%)
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{config.targetOEE}%</span>
                    </label>
                    <input 
                        type="range" 
                        min="50" max="100" 
                        value={config.targetOEE} 
                        onChange={(e) => handleChange(area as ProcessArea, 'targetOEE', e.target.value)}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 flex justify-between">
                        Eficiencia Laboral Objetivo (%)
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{config.targetLaborEfficiency}%</span>
                    </label>
                    <input 
                        type="range" 
                        min="50" max="120" 
                        value={config.targetLaborEfficiency} 
                        onChange={(e) => handleChange(area as ProcessArea, 'targetLaborEfficiency', e.target.value)}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Rendimiento Esperado (kg/h)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={config.expectedThroughput} 
                            onChange={(e) => handleChange(area as ProcessArea, 'expectedThroughput', e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-slate-700 font-mono"
                        />
                        <span className="absolute right-4 top-2 text-slate-400 text-sm">kg/h</span>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigPanel;