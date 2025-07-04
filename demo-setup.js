// Demo Setup Script for Task 5 Location Simulation
// Run this in browser console before demo to ensure optimal conditions

console.log("🎬 Setting up Task 5 Location Simulation Demo...");

// Clear any existing data to ensure clean state
localStorage.clear();

// Enhanced demo data with more realistic scenarios
const demoOperators = [
  {
    id: 1,
    name: 'Gururaja',
    email: 'mail@gururaja.in',
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
    name: 'Akash',
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
    name: 'Santhosh',
    email: 'mike.wilson@company.com',
    role: 'operator',
    shift: 'day',
    status: 'break',  // Demo: shows status-aware movement
    currentMachine: 'CAT 950M Loader',
    performanceScore: 78,
    hoursWorked: 5.8,
    tasksCompleted: 2,
    currentLocation: { x: 200, y: 55, zone: 'central' },
    lastLocationUpdate: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Aananthi',
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

const demoTasks = [
  {
    id: 1,
    title: 'Excavate Foundation Site A',
    description: 'Dig foundation for new building structure according to specifications',
    assignedOperator: 'Gururaja',
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
      updatedBy: 'Gururaja',
      user: 'Gururaja',
      action: 'progress_update'
    }],
    timeSpent: 360,
    lastUpdated: new Date().toISOString(),
    distanceFromOperator: 25 // Very close - good for demo
  },
  {
    id: 2,
    title: 'Level Ground Zone B',
    description: 'Use bulldozer to level terrain for construction preparation',
    assignedOperator: 'Akash',
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
    title: 'Transport Materials to Zone C',
    description: 'Move construction materials from storage to construction area',
    assignedOperator: 'Gururaja',
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
    lastUpdated: new Date().toISOString(),
    distanceFromOperator: 67 // Medium distance - shows prioritization
  },
  {
    id: 4,
    title: 'Equipment Safety Inspection',
    description: 'Perform routine safety check on loader equipment',
    assignedOperator: 'Gururaja',
    machine: 'CAT 950M Loader',
    status: 'pending',
    priority: 'medium',
    estimatedDuration: 2,
    location: 'Maintenance Bay',
    locationCoordinates: { x: 150, y: 400, zone: 'south' },
    progress: 0,
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    progressHistory: [],
    timeSpent: 0,
    lastUpdated: new Date().toISOString(),
    distanceFromOperator: 245 // Far distance - shows sorting
  },
  {
    id: 5,
    title: 'Clean Equipment Storage',
    description: 'Organize and clean equipment storage area',
    assignedOperator: 'Akash',
    machine: 'None',
    status: 'pending',
    priority: 'low',
    estimatedDuration: 3,
    location: 'Equipment Storage',
    locationCoordinates: { x: 400, y: 100, zone: 'east' },
    progress: 0,
    dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    progressHistory: [],
    timeSpent: 0,
    lastUpdated: new Date().toISOString()
  }
];

const demoMachines = [
  {
    id: 1,
    model: 'CAT 336F Excavator',
    type: 'excavator',
    serialNumber: 'CAT336F-2024-001',
    status: 'active',
    operator: 'Gururaja',
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
    operator: 'Akash',
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
    operator: 'Santhosh',
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

const siteLocations = [
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

// Store demo data
localStorage.setItem('operators', JSON.stringify(demoOperators));
localStorage.setItem('tasks', JSON.stringify(demoTasks));
localStorage.setItem('machines', JSON.stringify(demoMachines));
localStorage.setItem('siteLocations', JSON.stringify(siteLocations));

// Set a demo user
localStorage.setItem('currentUser', JSON.stringify({
  name: 'Demo Admin',
  role: 'admin'
}));

console.log(" Demo data loaded successfully!");
console.log(" Operators:", demoOperators.length);
console.log("📋 Tasks:", demoTasks.length);
console.log("🚜 Machines:", demoMachines.length);
console.log(" Locations:", siteLocations.length);
console.log("");
console.log("🎬 Demo Ready! Refresh the page and navigate to Machines page");
console.log("");
console.log("🎯 Demo Highlights:");
console.log("• Gururaja has 3 tasks at varying distances (25m, 67m, 245m)");
console.log("• Santhosh is on 'break' - won't move during simulation");
console.log("• Akash has active tasks in Construction Zone B");
console.log("• All machines have realistic fuel levels and status");
console.log("• Aananthi (supervisor) has no assigned tasks - shows edge case");
console.log("");
console.log("🚀 Perfect for demonstrating proximity-based task prioritization!");

// Additional demo helper functions
window.demoHelpers = {
  // Quick function to move John to different zones for demo
  moveJohnTo: (location) => {
    const operators = JSON.parse(localStorage.getItem('operators'));
    const johnIndex = operators.findIndex(op => op.name === 'Gururaja');
    if (johnIndex !== -1) {
      const locations = {
        'north': { x: 105, y: 195, zone: 'north' },
        'south': { x: 250, y: 350, zone: 'south' },
        'east': { x: 295, y: 145, zone: 'east' },
        'west': { x: 75, y: 300, zone: 'west' },
        'center': { x: 200, y: 100, zone: 'central' }
      };
      if (locations[location]) {
        operators[johnIndex].currentLocation = locations[location];
        localStorage.setItem('operators', JSON.stringify(operators));
        console.log(`John moved to ${location} zone`);
      }
    }
  },
  
  // Quick function to show all task distances for John
  showTaskDistances: () => {
    const operators = JSON.parse(localStorage.getItem('operators'));
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const john = operators.find(op => op.name === 'Gururaja');
    if (john) {
      const johnTasks = tasks.filter(t => t.assignedOperator === 'Gururaja');
      johnTasks.forEach(task => {
        const distance = Math.sqrt(
          Math.pow(john.currentLocation.x - task.locationCoordinates.x, 2) +
          Math.pow(john.currentLocation.y - task.locationCoordinates.y, 2)
        );
        console.log(`📋 ${task.title}: ${Math.round(distance)}m (${task.priority} priority)`);
      });
    }
  }
};

console.log("🛠️ Demo helper functions available:");
console.log("• demoHelpers.moveJohnTo('north|south|east|west|center')");
console.log("• demoHelpers.showTaskDistances()"); 