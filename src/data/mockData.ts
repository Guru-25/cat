// Types for our mock data
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
  progress: number; // percentage
  progressHistory?: ProgressEntry[];
  timeSpent?: number; // in minutes
  lastUpdated?: string;
  dueDate: string;
  createdAt: string;
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
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface SafetyIncident {
  id: number;
  type: 'near-miss' | 'minor' | 'major' | 'equipment-damage';
  description: string;
  operator: string;
  machine: string;
  location: string;
  timestamp: string;
  status: 'reported' | 'investigating' | 'resolved';
  severity: 1 | 2 | 3 | 4 | 5;
}

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
    tasksCompleted: 3
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
    tasksCompleted: 4
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
    progress: 75,
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    progressHistory: [{
      timestamp: new Date().toISOString(),
      progress: 75,
      status: 'in-progress',
      notes: 'Making good progress on excavation',
      updatedBy: 'John Smith'
    }],
    timeSpent: 360,
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
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-02-15'
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
    timestamp: '2024-01-28 14:30:00',
    status: 'resolved',
    severity: 2
  }
];

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