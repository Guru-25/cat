// Types for our mock data

// Location coordinate interface
export interface Coordinates {
  x: number;
  y: number;
  zone?: string;
}

// Location with name and coordinates
export interface Location {
  name: string;
  coordinates: Coordinates;
  type: 'construction' | 'storage' | 'office' | 'maintenance' | 'parking';
}

export interface Operator {
  id: number;
  name: string;
  email: string;
  role: 'operator' | 'supervisor' | 'admin';
  shift: 'day' | 'night';
  status: 'active' | 'offline' | 'break';
  currentMachine?: string;
  performanceScore: number;
  hoursWorked: number;
  tasksCompleted: number;
  currentLocation: Coordinates;
  lastLocationUpdate?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedOperator: string;
  machine: string;
  status: 'pending' | 'in-progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number; // in hours
  actualDuration?: number;
  startTime?: string;
  endTime?: string;
  location: string;
  locationCoordinates: Coordinates;
  progress: number; // percentage
  progressHistory?: ProgressEntry[];
  timeSpent?: number; // in minutes
  lastUpdated?: string;
  dueDate: string;
  createdAt: string;
  distanceFromOperator?: number; // calculated distance in meters
}

export interface ProgressEntry {
  timestamp: string;
  progress?: number;
  status?: string;
  notes?: string;
  updatedBy?: string;
  user: string;
  action: string;
}

export interface Machine {
  id: number;
  model: string;
  type: 'excavator' | 'bulldozer' | 'grader' | 'truck' | 'loader';
  serialNumber: string;
  status: 'active' | 'maintenance' | 'idle' | 'offline';
  operator?: string;
  fuelLevel: number; // percentage
  hoursOperated: number;
  location: string;
  locationCoordinates: Coordinates;
  lastMaintenance: string;
  nextMaintenance: string;
  lastLocationUpdate?: string;
}

export interface SafetyIncident {
  id: number;
  type: 'near-miss' | 'minor' | 'major' | 'equipment-damage';
  description: string;
  operator: string;
  machine: string;
  location: string;
  locationCoordinates: Coordinates;
  timestamp: string;
  status: 'reported' | 'investigating' | 'resolved';
  severity: 1 | 2 | 3 | 4 | 5;
}

// Predefined locations for the construction site
export const siteLocations: Location[] = [
  { name: 'Construction Zone A', coordinates: { x: 100, y: 200, zone: 'north' }, type: 'construction' },
  { name: 'Construction Zone B', coordinates: { x: 300, y: 150, zone: 'east' }, type: 'construction' },
  { name: 'Construction Zone C', coordinates: { x: 250, y: 350, zone: 'south' }, type: 'construction' },
  { name: 'Material Storage', coordinates: { x: 50, y: 100, zone: 'west' }, type: 'storage' },
  { name: 'Equipment Storage', coordinates: { x: 400, y: 100, zone: 'east' }, type: 'storage' },
  { name: 'Main Office', coordinates: { x: 200, y: 50, zone: 'central' }, type: 'office' },
  { name: 'Maintenance Bay', coordinates: { x: 150, y: 400, zone: 'south' }, type: 'maintenance' },
  { name: 'Parking Area', coordinates: { x: 350, y: 400, zone: 'south' }, type: 'parking' },
  { name: 'Loading Dock', coordinates: { x: 75, y: 300, zone: 'west' }, type: 'storage' },
  { name: 'Safety Station', coordinates: { x: 200, y: 100, zone: 'central' }, type: 'office' }
];

// Mock data
export const mockOperators: Operator[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'operator',
    shift: 'day',
    status: 'active',
    currentMachine: 'CAT 336F Excavator',
    performanceScore: 85,
    hoursWorked: 6.5,
    tasksCompleted: 3,
    currentLocation: { x: 105, y: 195, zone: 'north' },
    lastLocationUpdate: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'operator',
    shift: 'day',
    status: 'active',
    currentMachine: 'CAT D6T Bulldozer',
    performanceScore: 92,
    hoursWorked: 7.2,
    tasksCompleted: 4,
    currentLocation: { x: 295, y: 145, zone: 'east' },
    lastLocationUpdate: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    role: 'operator',
    shift: 'day',
    status: 'break',
    currentMachine: 'CAT 950M Loader',
    performanceScore: 78,
    hoursWorked: 5.8,
    tasksCompleted: 2,
    currentLocation: { x: 200, y: 55, zone: 'central' },
    lastLocationUpdate: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Lisa Chen',
    email: 'lisa.chen@company.com',
    role: 'supervisor',
    shift: 'day',
    status: 'active',
    performanceScore: 95,
    hoursWorked: 8.0,
    tasksCompleted: 6,
    currentLocation: { x: 205, y: 48, zone: 'central' },
    lastLocationUpdate: new Date().toISOString()
  }
];

export const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Excavate Foundation Site A',
    description: 'Dig foundation for new building structure according to specifications',
    assignedOperator: 'John Smith',
    machine: 'CAT 336F Excavator',
    status: 'in-progress',
    priority: 'high',
    estimatedDuration: 8,
    actualDuration: 6,
    startTime: '08:00',
    location: 'Construction Zone A',
    locationCoordinates: { x: 100, y: 200, zone: 'north' },
    progress: 75,
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    progressHistory: [{
      timestamp: new Date().toISOString(),
      progress: 75,
      status: 'in-progress',
      notes: 'Making good progress on excavation',
      updatedBy: 'John Smith',
      user: 'John Smith',
      action: 'progress_update'
    }],
    timeSpent: 360,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Level Ground Zone B',
    description: 'Use bulldozer to level terrain for construction preparation',
    assignedOperator: 'Sarah Johnson',
    machine: 'CAT D6T Bulldozer',
    status: 'pending',
    priority: 'medium',
    estimatedDuration: 6,
    startTime: '09:00',
    location: 'Construction Zone B',
    locationCoordinates: { x: 300, y: 150, zone: 'east' },
    progress: 0,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    progressHistory: [],
    timeSpent: 0,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Transport Materials',
    description: 'Move construction materials from storage to Zone C',
    assignedOperator: 'Mike Wilson',
    machine: 'CAT 950M Loader',
    status: 'pending',
    priority: 'high',
    estimatedDuration: 4,
    location: 'Material Storage',
    locationCoordinates: { x: 50, y: 100, zone: 'west' },
    progress: 0,
    dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    progressHistory: [],
    timeSpent: 0,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Equipment Maintenance Check',
    description: 'Perform routine maintenance on loader equipment',
    assignedOperator: 'Lisa Chen',
    machine: 'CAT 950M Loader',
    status: 'pending',
    priority: 'medium',
    estimatedDuration: 3,
    location: 'Maintenance Bay',
    locationCoordinates: { x: 150, y: 400, zone: 'south' },
    progress: 0,
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    progressHistory: [],
    timeSpent: 0,
    lastUpdated: new Date().toISOString()
  }
];

export const mockMachines: Machine[] = [
  {
    id: 1,
    model: 'CAT 336F Excavator',
    type: 'excavator',
    serialNumber: 'CAT336F-2024-001',
    status: 'active',
    operator: 'John Smith',
    fuelLevel: 85,
    hoursOperated: 1250,
    location: 'Construction Zone A',
    locationCoordinates: { x: 100, y: 200, zone: 'north' },
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-02-15',
    lastLocationUpdate: new Date().toISOString()
  },
  {
    id: 2,
    model: 'CAT D6T Bulldozer',
    type: 'bulldozer',
    serialNumber: 'CATD6T-2024-002',
    status: 'active',
    operator: 'Sarah Johnson',
    fuelLevel: 72,
    hoursOperated: 980,
    location: 'Construction Zone B',
    locationCoordinates: { x: 300, y: 150, zone: 'east' },
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10',
    lastLocationUpdate: new Date().toISOString()
  },
  {
    id: 3,
    model: 'CAT 950M Loader',
    type: 'loader',
    serialNumber: 'CAT950M-2024-003',
    status: 'idle',
    operator: 'Mike Wilson',
    fuelLevel: 95,
    hoursOperated: 756,
    location: 'Parking Area',
    locationCoordinates: { x: 350, y: 400, zone: 'south' },
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-02-20',
    lastLocationUpdate: new Date().toISOString()
  },
  {
    id: 4,
    model: 'CAT 320 Excavator',
    type: 'excavator',
    serialNumber: 'CAT320-2024-004',
    status: 'maintenance',
    fuelLevel: 60,
    hoursOperated: 1450,
    location: 'Maintenance Bay',
    locationCoordinates: { x: 150, y: 400, zone: 'south' },
    lastMaintenance: '2024-01-28',
    nextMaintenance: '2024-02-28',
    lastLocationUpdate: new Date().toISOString()
  }
];

export const mockSafetyIncidents: SafetyIncident[] = [
  {
    id: 1,
    type: 'near-miss',
    description: 'Pedestrian walked too close to excavator during operation',
    operator: 'John Smith',
    machine: 'CAT 336F Excavator',
    location: 'Construction Zone A',
    locationCoordinates: { x: 100, y: 200, zone: 'north' },
    timestamp: '2024-01-28 14:30:00',
    status: 'resolved',
    severity: 2
  },
  {
    id: 2,
    type: 'minor',
    description: 'Small hydraulic fluid leak detected on bulldozer',
    operator: 'Sarah Johnson',
    machine: 'CAT D6T Bulldozer',
    location: 'Construction Zone B',
    locationCoordinates: { x: 300, y: 150, zone: 'east' },
    timestamp: '2024-01-27 11:15:00',
    status: 'investigating',
    severity: 1
  }
];

// Location utility functions
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const dx = coord1.x - coord2.x;
  const dy = coord1.y - coord2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getLocationByName = (locationName: string): Location | undefined => {
  return siteLocations.find(loc => loc.name === locationName);
};

export const getLocationsByType = (type: Location['type']): Location[] => {
  return siteLocations.filter(loc => loc.type === type);
};

// Initialize mock data in localStorage
export const initializeMockData = () => {
  if (!localStorage.getItem('operators')) {
    localStorage.setItem('operators', JSON.stringify(mockOperators));
  }
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(mockTasks));
  }
  if (!localStorage.getItem('machines')) {
    localStorage.setItem('machines', JSON.stringify(mockMachines));
  }
  if (!localStorage.getItem('safetyIncidents')) {
    localStorage.setItem('safetyIncidents', JSON.stringify(mockSafetyIncidents));
  }
  if (!localStorage.getItem('siteLocations')) {
    localStorage.setItem('siteLocations', JSON.stringify(siteLocations));
  }
};

// Helper functions to get data from localStorage
export const getOperators = (): Operator[] => {
  const data = localStorage.getItem('operators');
  return data ? JSON.parse(data) : mockOperators;
};

export const getTasks = (): Task[] => {
  const data = localStorage.getItem('tasks');
  return data ? JSON.parse(data) : mockTasks;
};

export const getMachines = (): Machine[] => {
  const data = localStorage.getItem('machines');
  return data ? JSON.parse(data) : mockMachines;
};

export const getSafetyIncidents = (): SafetyIncident[] => {
  const data = localStorage.getItem('safetyIncidents');
  return data ? JSON.parse(data) : mockSafetyIncidents;
};

export const getSiteLocations = (): Location[] => {
  const data = localStorage.getItem('siteLocations');
  return data ? JSON.parse(data) : siteLocations;
};

// Location-based task prioritization
export const getTasksWithDistance = (operatorLocation: Coordinates): Task[] => {
  const tasks = getTasks();
  return tasks.map(task => ({
    ...task,
    distanceFromOperator: calculateDistance(operatorLocation, task.locationCoordinates)
  })).sort((a, b) => (a.distanceFromOperator || 0) - (b.distanceFromOperator || 0));
};

// Update operator location
export const updateOperatorLocation = (operatorId: number, newLocation: Coordinates): void => {
  const operators = getOperators();
  const updatedOperators = operators.map(op => 
    op.id === operatorId 
      ? { ...op, currentLocation: newLocation, lastLocationUpdate: new Date().toISOString() }
      : op
  );
  localStorage.setItem('operators', JSON.stringify(updatedOperators));
};

// Update machine location
export const updateMachineLocation = (machineId: number, newLocation: Coordinates): void => {
  const machines = getMachines();
  const updatedMachines = machines.map(machine => 
    machine.id === machineId 
      ? { ...machine, locationCoordinates: newLocation, lastLocationUpdate: new Date().toISOString() }
      : machine
  );
  localStorage.setItem('machines', JSON.stringify(updatedMachines));
}; 