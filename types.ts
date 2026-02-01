// Process Areas based on the plant description
export enum ProcessArea {
  SELECTION = 'Selección',
  WASHING = 'Túnel de Lavado',
  DRYING = 'Secado',
  CALANDRAS = 'Calandras (Acabado)',
}

// User Roles
export enum UserRole {
  ADMIN = 'Administrador', // Plant Manager
  MAINTENANCE = 'Mantenimiento', // Can edit configs
  OPERATOR = 'Operario', // View only limited
  GUEST = 'Invitado'
}

// Resource Consumption Structure
export interface ResourceConsumption {
  electricity: number; // kW
  gas: number; // m3/h
  water: number; // lts (per cycle or hour)
  steam: number; // m3/h
}

// Configuration Parameters (Targets)
export interface ProcessTargets {
  targetOEE: number;
  targetLaborEfficiency: number;
  expectedThroughput: number; // kg/h
}

// KPI Data Structure for a specific time period
export interface KPIData {
  month: string;
  year: number;
  
  // Machine KPIs
  availability: number; // %
  performance: number; // %
  quality: number; // %
  oee: number; // % (Avail * Perf * Qual)
  
  // Human KPIs
  laborEfficiency: number; // units/hr or kg/hr per person
  ole: number; // Overall Labor Effectiveness %
  learningPercentage: number; // %

  // Production
  throughputKg: number;
  cycleTime: number; // minutes
  capacityUtilization: number; // %
  downtimeMinutes: number;
  
  // Resources
  resources: ResourceConsumption;
}

// Global App State
export interface AppState {
  currentUser: {
    name: string;
    role: UserRole;
  } | null;
  activeTab: 'dashboard' | 'settings' | 'reports';
  selectedProcess: ProcessArea | 'General';
}