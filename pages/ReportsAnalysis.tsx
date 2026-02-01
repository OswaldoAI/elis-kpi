import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, ReferenceLine, ComposedChart, Line
} from 'recharts';
import { Brain, Sparkles, AlertTriangle, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { ProcessArea } from '../types';
import { MONTHS } from '../constants';

// Interfaces locales para la simulación
interface PredictionData {
  month: string;
  optimistic: number;
  realistic: number;
  pessimistic: number;
  downtimeRisk: number; // Horas probables de parada
}

interface RiskInsight {
  area: string;
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  probability: number;
  description: string;
}

const ReportsAnalysis: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
  const [insights, setInsights] = useState<RiskInsight[]>([]);

  const runSimulation = () => {
    setIsSimulating(true);
    setHasResults(false);

    // Simular retardo de procesamiento de IA
    setTimeout(() => {
      const data: PredictionData[] = MONTHS.map((month, idx) => {
        // Base de tendencia con estacionalidad (verano más alto)
        const seasonalFactor = (idx > 4 && idx < 8) ? 1.1 : 1.0;
        const baseOEE = 82 + (Math.random() * 5); 

        return {
          month,
          optimistic: Math.min(100, (baseOEE * 1.08 * seasonalFactor)),
          realistic: Math.min(100, (baseOEE * seasonalFactor)),
          pessimistic: Math.max(50, (baseOEE * 0.90 * seasonalFactor)),
          downtimeRisk: Math.floor(Math.random() * 40) + (seasonalFactor > 1 ? 15 : 5)
        };
      });

      const aiInsights: RiskInsight[] = [
        {
          area: ProcessArea.WASHING,
          riskLevel: 'Alto',
          probability: 85,
          description: 'Desgaste proyectado en bombas hidráulicas del Túnel para Q3 2026 debido al aumento de carga en verano.'
        },
        {
          area: ProcessArea.CALANDRAS,
          riskLevel: 'Medio',
          probability: 60,
          description: 'Posible saturación de rodillos en Mayo 2026. Se recomienda mantenimiento preventivo anticipado.'
        },
        {
          area: ProcessArea.SELECTION,
          riskLevel: 'Bajo',
          probability: 15,
          description: 'Flujo estable. La eficiencia del personal se proyecta con una mejora del 5%.'
        }
      ];

      setPredictionData(data);
      setInsights(aiInsights);
      setIsSimulating(false);
      setHasResults(true);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header Sección */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="text-purple-400" size={24} />
            <h2 className="text-2xl font-bold tracking-tight">Generador Predictivo IA 2026</h2>
          </div>
          <p className="text-slate-300 max-w-xl">
            Utiliza algoritmos de aprendizaje automático para estimar la productividad (OEE) y predecir ventanas de mantenimiento crítico para el próximo año fiscal.
          </p>
        </div>
        
        <button 
          onClick={runSimulation}
          disabled={isSimulating}
          className={`
            mt-6 md:mt-0 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg
            ${isSimulating 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-500 text-white hover:scale-105 shadow-purple-500/30'}
          `}
        >
          {isSimulating ? (
            <>
              <Sparkles className="animate-spin" size={20} /> Procesando Modelos...
            </>
          ) : (
            <>
              <Sparkles size={20} /> Ejecutar Generador IA
            </>
          )}
        </button>
      </div>

      {!hasResults && !isSimulating && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <Brain size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600">Modelo Inactivo</h3>
            <p className="text-slate-400">Presiona el botón para generar las proyecciones del 2026.</p>
        </div>
      )}

      {hasResults && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Gráfico Principal de Proyección OEE */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Proyección de Productividad (OEE) 2026</h3>
                        <p className="text-xs text-slate-500">Intervalos de confianza del 95%</p>
                    </div>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <Calendar size={12} className="mr-1"/> Año Fiscal 2026
                    </span>
                </div>
                
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={predictionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorOeeOptimistic" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <YAxis domain={[40, 110]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend />
                            
                            <Area type="monotone" dataKey="optimistic" name="Escenario Optimista" stroke="none" fill="#10b981" fillOpacity={0.1} />
                            <Area type="monotone" dataKey="pessimistic" name="Escenario Pesimista" stroke="none" fill="#ef4444" fillOpacity={0.1} />
                            <Line type="monotone" dataKey="realistic" name="Proyección IA (Media)" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4}} />
                            <ReferenceLine y={85} stroke="#64748b" strokeDasharray="3 3" label={{ position: 'right', value: 'Meta', fontSize: 10 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Insights Cards */}
            <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <AlertTriangle className="text-amber-500 mr-2" size={20} />
                        Alertas Predictivas
                    </h3>
                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-slate-700 text-sm">{insight.area}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold
                                        ${insight.riskLevel === 'Alto' ? 'bg-red-100 text-red-700' : 
                                          insight.riskLevel === 'Medio' ? 'bg-amber-100 text-amber-700' : 
                                          'bg-green-100 text-green-700'}`}>
                                        Riesgo {insight.riskLevel} ({insight.probability}%)
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    {insight.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gráfico de Riesgo de Paradas */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Estimación de Horas de Parada (Downtime) 2026</h3>
                    <p className="text-xs text-slate-500">Basado en ciclo de vida de activos y patrones históricos</p>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={predictionData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px' }} />
                            <Bar dataKey="downtimeRisk" name="Horas de Parada Estimadas" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalysis;