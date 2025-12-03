export interface VehicleData {
  make: string;
  model: string;
  yearRange: string;
  bodyType: string;
  engine: string;
  transmission: string;
  performance: string;
  description: string;
  keyFeatures: string[];
  isVehicle: boolean;
  confidenceScore: number;
}

export enum AppState {
  IDLE = 'IDLE',
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}