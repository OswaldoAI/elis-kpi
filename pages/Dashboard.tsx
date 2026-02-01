import React, { useEffect, useState, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ReferenceLine
} from 'recharts';
import { ProcessArea, KPIData } from '../types';
import { generateHistoricalData, getLiveProcessStatus } from '../services/simulationService';
import { Zap, Droplets, Flame, Clock, TrendingUp, AlertTriangle, Users, Box } from 'lucide-react';
import { DEFAULT_TARGETS } from '../constants';

interface DashboardProps {
  selectedProcess: ProcessArea | 'General';
}

const Dashboard: React.FC<DashboardProps> = ({ selectedProcess }) => {
  // State for Historical Data
  const [historicalData, setHistoricalData] = useState<KPIData[]>([]);
  // State for Real-time dummy tickers
  const [liveStats, setLiveStats] = useState<any>(null);
  
  // Initialize Data
  useEffect(() => {
    if (selectedProcess === 'General') {
      // Aggregate data from all processes for overview
      const allData: Record<string, KPIData[]> = {};
      Object.values(ProcessArea).forEach(area => {
        allData[area] = generateHistoricalData(area);
      });
      
      // Create an average/sum dataset for the overview
      const overviewData = allData[ProcessArea.WASHING].map((_, index) => {
        let totalOEE = 0;
        let totalKg = 0;
        let totalEnergy = 0;
        const areas = Object.values(ProcessArea);
        
        areas.forEach(area => {
           const d = allData[area][index];
           totalOEE += d.oee;
           totalKg += d.throughputKg;
           totalEnergy += d.resources.electricity;
        });

        return {
           ...allData[ProcessArea.WASHING][index], // Base structure
           oee: +(totalOEE / areas.length).toFixed(1),
           throughputKg: totalKg,
           resources: {
             ...allData[ProcessArea.WASHING][index].resources,
             electricity: totalEnergy
           }
        };
      });
      setHistoricalData(overviewData);
      setLiveStats(null); // Overview has no single machine live stat
    } else {
      setHistoricalData(generateHistoricalData(selectedProcess));
    }
  }, [selectedProcess]);

  // Live Tick Effect
  useEffect(() => {
    if (selectedProcess === 'General') return;
    
    const interval = setInterval(() => {
        setLiveStats(getLiveProcessStatus(selectedProcess));
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedProcess]);

  // Derived Metrics for Cards
  const avgOEE = useMemo(() => {
    if (historicalData.length === 0) return 0;
    return (historicalData.reduce((acc, curr) => acc + curr.oee, 0) / historicalData.length).toFixed(1);
  }, [historicalData]);

  const totalThroughput = useMemo(() => {
      return historicalData.reduce((acc, curr) => acc + curr.throughputKg, 0).toLocaleString();
  }, [historicalData]);

  const currentMonthData = historicalData[historicalData.length - 1] || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {selectedProcess === 'General' ? 'Visión General de Planta' : selectedProcess}
          </h2>
          <p className="text-slate-500 mt-1 text-sm">Métricas de Productividad • Datos Simulados 2025</p>
        </div>
        {selectedProcess !== 'General' && liveStats && (
            <div className={`flex items-center px-4 py-2 rounded-lg border ${liveStats.status === 'En Marcha' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`w-2.5 h-2.5 rounded-full mr-2 ${liveStats.status === 'En Marcha' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-semibold ${liveStats.status === 'En Marcha' ? 'text-green-700' : 'text-red-700'}`}>
                    {liveStats.status}
                </span>
            </div>
        )}
      </div>

      {/* KPI Cards Row 1: High Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
            title="OEE Promedio (YTD)" 
            value={`${avgOEE}%`} 
            icon={TrendingUp} 
            color="blue"
            subtext="Objetivo: >85%"
        />
        <KPICard 
            title="Rendimiento Total" 
            value={`${totalThroughput} kg`} 
            icon={Box} 
            color="indigo" 
            subtext="Proyectado 2025"
        />
        <KPICard 
            title="Eficiencia Laboral" 
            value={`${currentMonthData.laborEfficiency || 0}%`} 
            icon={Users} 
            color="emerald"
            subtext="Mes Pasado"
        />
         <KPICard 
            title="Tiempo de Ciclo" 
            value={`${currentMonthData.cycleTime ? currentMonthData.cycleTime.toFixed(1) : 0} m`} 
            icon={Clock} 
            color="amber"
            subtext="Promedio por lote"
        />
      </div>

      {/* Live Resource Monitor (Only for specific processes) */}
      {selectedProcess !== 'General' && liveStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
             <div className="col-span-full mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Consumo de Recursos en Vivo</h3>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-slate-300">Tiempo Real</span>
             </div>
             
             <LiveMetric label="Energía" value={liveStats.instantKw} unit="kW" icon={Zap} color="text-yellow-400" />
             <LiveMetric label="Gas" value={liveStats.instantGas} unit="m³/h" icon={Flame} color="text-orange-400" />
             <LiveMetric label="Agua" value={liveStats.instantWater} unit="L/min" icon={Droplets} color="text-blue-400" />
             <LiveMetric label="Tasa Actual" value={liveStats.currentThroughput} unit="kg/h" icon={TrendingUp} color="text-green-400" />
        </div>
      )}

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* OEE Trend - Large Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Eficiencia de equipos y Procesos OEE</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorOee" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 100]} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{paddingTop: '20px'}} />
                        <ReferenceLine y={85} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'right', value: 'Objetivo', fill: '#10b981', fontSize: 10 }} />
                        <Area type="monotone" dataKey="oee" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorOee)" name="OEE %" />
                        <Line type="monotone" dataKey="availability" stroke="#6366f1" strokeWidth={2} dot={false} name="Disponibilidad" />
                        <Line type="monotone" dataKey="quality" stroke="#ec4899" strokeWidth={2} dot={false} name="Calidad" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Productivity Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Salida de Producción (kg)</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px' }} />
                        <Bar dataKey="throughputKg" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Kg Producidos" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Eficiencia Laboral (OLE)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" hide />
                        <YAxis domain={[60, 110]} hide />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="laborEfficiency" stroke="#10b981" strokeWidth={2} name="Eficiencia Laboral" />
                        <Line type="monotone" dataKey="learningPercentage" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Curva de Aprendizaje" />
                    </LineChart>
                </ResponsiveContainer>
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Histórico de Consumo de Recursos</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                        <defs>
                            <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tick={{fontSize: 10}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="resources.electricity" stroke="#f59e0b" fill="url(#colorPower)" name="Electricidad (kW total)" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
      </div>
    </div>
  );
};

// Sub-components
const KPICard = ({ title, value, icon: Icon, color, subtext }: any) => {
    // Dynamic color mapping safely
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600'
    };
    const iconClass = colorClasses[color] || colorClasses.blue;

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${iconClass}`}>
                    <Icon size={20} />
                </div>
            </div>
            {subtext && <p className="text-xs text-slate-400 mt-3 font-medium">{subtext}</p>}
        </div>
    );
};

const LiveMetric = ({ label, value, unit, icon: Icon, color }: any) => (
    <div className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center text-slate-400 text-xs mb-2">
            <Icon size={12} className={`mr-1 ${color}`} /> {label}
        </div>
        <div className="text-xl font-mono font-bold tracking-tight">
            {value} <span className="text-xs font-sans font-normal text-slate-500">{unit}</span>
        </div>
    </div>
);

export default Dashboard;