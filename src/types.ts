export type TransitLineCode = 'NS' | 'EW' | 'DT' | 'TE' | 'CC' | 'NE';

export interface TransitLineStatus {
  code: TransitLineCode;
  name: string;
  color: string;
  status: 'Good Service' | 'Minor Delay' | 'Normal (3-4m)' | 'Disruption' | 'Planned Maintenance';
  statusType: 'good' | 'warning' | 'delay' | 'normal';
  details?: string;
  updatedAgo: string;
  frequency: string;
}

export interface TransitStation {
  id: string;
  name: string;
  lines: TransitLineCode[];
  cx: number;
  cy: number;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  isInterchange?: boolean;
  code?: string;
  nextTrains?: {
    direction: string;
    next: string;
    subsequent: string;
    crowd: 'low' | 'moderate' | 'high';
  }[];
}

export interface RouteStep {
  type: 'walk' | 'mrt' | 'bus' | 'transfer';
  line?: TransitLineCode;
  lineName?: string;
  busNumber?: string;
  durationMin: number;
  instruction: string;
  platform?: string;
  stopsCount?: number;
  color?: string;
}

export interface CommuteOption {
  id: string;
  durationMin: number;
  tag?: string;
  tagType?: 'fastest' | 'fewest' | 'recommended' | 'eco';
  departureTime: string;
  arrivalTime: string;
  fare: string;
  crowdLevel: 'Low Crowd' | 'Moderate' | 'High Crowd';
  crowdType: 'low' | 'moderate' | 'high';
  frequency: string;
  mode: 'mrt' | 'bus' | 'cab' | 'cycle' | 'walk';
  pathId?: string;
  steps: RouteStep[];
  co2Saved?: string;
}

export type NavTab = 'directions' | 'live-transit' | 'mrt-lrt-lines' | 'bus-network' | 'cycle-walk' | 'feedback';

export interface CityOption {
  id: string;
  name: string;
  flag: string;
  country: string;
  active: boolean;
}
