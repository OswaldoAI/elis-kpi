import { KPIData, ProcessArea, ResourceConsumption } from "../types";
import { MACHINE_SPECS, MONTHS } from "../constants";

// Helper for randomness
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate 1 Year of Data (2025)
export const generateHistoricalData = (process: ProcessArea): KPIData[] => {
  const specs = MACHINE_SPECS[process];
  const data: KPIData[] = [];

  MONTHS.forEach((month, index) => {
    // Simulate slight seasonal variation (busy summer for hotels)
    const seasonality = (index > 4 && index < 8) ? 1.1 : 1.0; 
    
    // Core randomizers
    const availability = Math.min(100, randomRange(85, 98));
    const performance = Math.min(100, randomRange(80, 95) * seasonality);
    const quality = Math.min(100, randomRange(92, 99.5));
    
    const oee = (availability * performance * quality) / 10000; // Result 0-100 scale

    // Throughput logic
    const throughputKg = specs.maxThroughput * (performance / 100) * 160; // Approx 160 working hours/month
    
    // Resources (Total monthly based on throughput utilization)
    const utilizationRate = performance / 100;
    const resources: ResourceConsumption = {
      electricity: specs.power * 160 * utilizationRate,
      gas: specs.gas * 160 * utilizationRate,
      steam: specs.steam * 160 * utilizationRate,
      water: (specs.water || 0) * 160 * utilizationRate, // Simplified
    };

    // Human Factors
    const laborEfficiency = Math.min(100, randomRange(80, 105));
    const ole = (availability * laborEfficiency * quality) / 10000;

    data.push({
      month,
      year: 2025,
      availability: Number(availability.toFixed(1)),
      performance: Number(performance.toFixed(1)),
      quality: Number(quality.toFixed(1)),
      oee: Number(oee.toFixed(1)),
      laborEfficiency: Number(laborEfficiency.toFixed(1)),
      ole: Number(ole.toFixed(1)),
      learningPercentage: Math.min(100, randomRange(90, 100) + (index * 0.5)), // Learns over the year
      throughputKg: Math.floor(throughputKg),
      cycleTime: randomRange(25, 35), // arbitrary base minutes per batch
      capacityUtilization: Number((utilizationRate * 100).toFixed(1)),
      downtimeMinutes: Math.floor(randomRange(0, 500)),
      resources: {
        electricity: Math.floor(resources.electricity),
        gas: Math.floor(resources.gas),
        water: Math.floor(resources.water),
        steam: Math.floor(resources.steam),
      }
    });
  });

  return data;
};

// Generate Instantaneous Live Data
export const getLiveProcessStatus = (process: ProcessArea) => {
  const specs = MACHINE_SPECS[process];
  const isRunning = Math.random() > 0.1; // 90% chance running

  if (!isRunning) {
    return {
      status: 'Detenido',
      instantKw: 0,
      instantGas: 0,
      instantWater: 0,
      currentThroughput: 0,
      alerts: Math.random() > 0.8 ? ['Mantenimiento requerido'] : []
    };
  }

  return {
    status: 'En Marcha',
    instantKw: Number((specs.power * randomRange(0.8, 1.1)).toFixed(2)),
    instantGas: Number((specs.gas * randomRange(0.8, 1.1)).toFixed(2)),
    instantWater: Number(((specs.water || 0) / 60 * randomRange(0.9, 1.1)).toFixed(1)), // lts/min approximation
    currentThroughput: Math.floor(specs.maxThroughput * randomRange(0.85, 1.0)),
    alerts: []
  };
};