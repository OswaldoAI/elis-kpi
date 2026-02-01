import { ProcessArea, ProcessTargets } from "./types";

// Technical Specs from Prompt used for Simulation Baselines
export const MACHINE_SPECS = {
  [ProcessArea.SELECTION]: {
    units: 1, // 1 Conveyor
    staff: 4,
    maxThroughput: 120, // kg/h
    power: 0.76, // kW
    gas: 0,
    steam: 0,
    water: 0
  },
  [ProcessArea.WASHING]: {
    units: 1, // 1 Tunnel (+ manual backup ignored for main baseline to simplify)
    staff: 2,
    maxThroughput: 120, // kg/h
    power: 38, // kW
    gas: 10, // m3/h
    steam: 50, // m3/h
    water: 300 // lts per cycle (approx 12 cycles/h -> 3600)
  },
  [ProcessArea.DRYING]: {
    units: 4, // 4 Dryers
    staff: 0, // Automated from press, though usually supervised
    maxThroughput: 200, // 50 kg/h * 4
    power: 22.8, // 5.7 * 4
    gas: 200, // 50 * 4
    steam: 0,
    water: 0
  },
  [ProcessArea.CALANDRAS]: {
    units: 4, // 4 Calandras
    staff: 4, // 1 per calandra
    maxThroughput: 200, // 50 kg/h * 4
    power: 91.2, // 22.8 * 4
    gas: 320, // 80 * 4
    steam: 0,
    water: 0
  }
};

export const DEFAULT_TARGETS: Record<ProcessArea, ProcessTargets> = {
  [ProcessArea.SELECTION]: {
    targetOEE: 90,
    targetLaborEfficiency: 95,
    expectedThroughput: 110
  },
  [ProcessArea.WASHING]: {
    targetOEE: 85,
    targetLaborEfficiency: 90,
    expectedThroughput: 115
  },
  [ProcessArea.DRYING]: {
    targetOEE: 88,
    targetLaborEfficiency: 100, // Automated mostly
    expectedThroughput: 190
  },
  [ProcessArea.CALANDRAS]: {
    targetOEE: 82,
    targetLaborEfficiency: 85,
    expectedThroughput: 180
  }
};

export const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun", 
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];