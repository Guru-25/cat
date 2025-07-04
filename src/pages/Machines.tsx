import React, { useState, useEffect } from 'react';
import LocationMap from '../components/LocationMap';
import SafetyAlerts from '../components/SafetyAlerts';
import { 
  getMachines, 
  getOperators, 
  getTasks,
  getTasksWithDistance,
  getSiteLocations,
  calculateDistance,
  updateOperatorLocation,
  updateMachineLocation,
  initializeMockData,
  Machine, 
  Operator, 
  Task,
  Location,
  Coordinates 
} from '../data/mockData';

const Machines: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [proximityTasks, setProximityTasks] = useState<Task[]>([]);
  const [showDistances, setShowDistances] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);

  useEffect(() => {
    // Initialize mock data to ensure latest schema is in localStorage
    initializeMockData();
    loadData();
  }, []);

  useEffect(() => {
    if (selectedOperator) {
      const operator = operators.find(op => op.name === selectedOperator);
      if (operator && operator.currentLocation) {
        const tasksWithDistance = getTasksWithDistance(operator.currentLocation);
        setProximityTasks(tasksWithDistance.slice(0, 5)); // Top 5 closest tasks
      }
    }
  }, [selectedOperator, operators]);

  const loadData = () => {
    setMachines(getMachines());
    setOperators(getOperators());
    setTasks(getTasks());
  };

  const handleOperatorClick = (operator: Operator) => {
    setSelectedOperator(operator.name);
    setShowDistances(true);
  };

  const handleLocationClick = (location: Location) => {
    if (selectedOperator) {
      const operator = operators.find(op => op.name === selectedOperator);
      if (operator && operator.currentLocation) {
        const distance = calculateDistance(operator.currentLocation, location.coordinates);
        alert(`Distance from ${operator.name} to ${location.name}: ${Math.round(distance)} meters`);
      }
    }
  };

  const handleMachineClick = (machine: Machine) => {
    console.log('Machine clicked:', machine);
  };

  const moveOperatorToLocation = (operatorName: string, location: Location) => {
    const operator = operators.find(op => op.name === operatorName);
    if (operator) {
      // Add some randomness to avoid exact overlap
      const newLocation: Coordinates = {
        x: location.coordinates.x + (Math.random() - 0.5) * 20,
        y: location.coordinates.y + (Math.random() - 0.5) * 20,
        zone: location.coordinates.zone
      };
      
      updateOperatorLocation(operator.id, newLocation);
      loadData(); // Refresh data
    }
  };

  // Special demo function to move operator into safety alert range
  const triggerSafetyDemo = () => {
    const johnOperator = operators.find(op => op.name === 'Gururaja');
    if (johnOperator) {
      // Move John very close to the excavator to trigger proximity alert
      const newLocation: Coordinates = {
        x: 108, // Very close to excavator at (100, 200)
        y: 205,
        zone: 'north'
      };
      updateOperatorLocation(johnOperator.id, newLocation);
      loadData();
      alert(' Demo: Gururaja moved close to excavator - check Safety Alerts panel!');
    }
  };

  const startLocationSimulation = () => {
    setSimulationRunning(true);
    
    const simulationInterval = setInterval(() => {
      const currentOperators = getOperators();
      const currentMachines = getMachines();
      
      // Simulate operator movement (small random movements)
      currentOperators.forEach(operator => {
        if (operator.status === 'active' && operator.currentLocation) {
          const newLocation: Coordinates = {
            x: Math.max(10, Math.min(390, operator.currentLocation.x + (Math.random() - 0.5) * 10)),
            y: Math.max(10, Math.min(390, operator.currentLocation.y + (Math.random() - 0.5) * 10)),
            zone: operator.currentLocation.zone
          };
          updateOperatorLocation(operator.id, newLocation);
        }
      });
      
      // Simulate machine movement (slower, more deliberate)
      currentMachines.forEach(machine => {
        if (machine.status === 'active' && machine.locationCoordinates && Math.random() > 0.7) { // 30% chance to move
          const newLocation: Coordinates = {
            x: Math.max(10, Math.min(390, machine.locationCoordinates.x + (Math.random() - 0.5) * 5)),
            y: Math.max(10, Math.min(390, machine.locationCoordinates.y + (Math.random() - 0.5) * 5)),
            zone: machine.locationCoordinates.zone
          };
          updateMachineLocation(machine.id, newLocation);
        }
      });
      
      loadData(); // Refresh data
    }, 3000); // Update every 3 seconds
    
    // Stop simulation after 30 seconds
    setTimeout(() => {
      clearInterval(simulationInterval);
      setSimulationRunning(false);
    }, 30000);
  };

  const stopLocationSimulation = () => {
    setSimulationRunning(false);
  };

  const resetLocationData = () => {
    // Clear localStorage and reinitialize with new data structure
    localStorage.removeItem('operators');
    localStorage.removeItem('machines');
    localStorage.removeItem('tasks');
    localStorage.removeItem('safetyIncidents');
    localStorage.removeItem('siteLocations');
    
    // Reinitialize with new data
    initializeMockData();
    loadData();
    
    alert('Location data has been reset with the latest structure!');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Location & Machine Management</h1>
          <p className="text-gray-600">
            Real-time tracking of operator positions, machine locations, and proximity-based task prioritization with safety monitoring
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Simulation Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Operator Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Operator to Track
              </label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an operator...</option>
                {operators.map(operator => (
                  <option key={operator.id} value={operator.name}>
                    {operator.name} ({operator.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Movement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Move to Location
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value && selectedOperator) {
                    const location = getSiteLocations().find(loc => loc.name === e.target.value);
                    if (location) {
                      moveOperatorToLocation(selectedOperator, location);
                    }
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedOperator}
              >
                <option value="">Move to location...</option>
                {getSiteLocations().map((location, index) => (
                  <option key={index} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Simulation Controls
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Simulation
              </label>
              <div className="flex gap-2">
                <button
                  onClick={startLocationSimulation}
                  disabled={simulationRunning}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {simulationRunning ? 'Running...' : 'Start Sim'}
                </button>
                <button
                  onClick={() => setShowDistances(!showDistances)}
                  className={`flex-1 px-4 py-2 rounded-md border ${
                    showDistances 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Distances
                </button>
              </div>
            </div> */}

            {/* Reset Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Management
              </label>
              <button
                onClick={resetLocationData}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 mb-1"
              >
                🔄 Reset Data
              </button>
              {/* <button
                onClick={triggerSafetyDemo}
                className="w-full bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 text-xs"
              >
                 Safety Demo
              </button> */}
            </div>
          </div>

          {simulationRunning && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent mr-2"></div>
                <span className="text-yellow-800">
                  Location simulation running... Operators and machines are moving automatically.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Priority Layout: Machine Status & Tasks → Real-time Monitoring → Site Map */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* PRIORITY 1: Machine Status & Nearby Tasks */}
          <div className="xl:col-span-5 space-y-6">
            {/* Machine Status - Enhanced */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Machine Status Overview</h3>
                <div className="text-sm text-gray-500">
                  {machines.filter(m => m.status === 'active').length} of {machines.length} active
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {machines.map(machine => (
                  <div key={machine.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{machine.model}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        machine.status === 'active' ? 'bg-green-100 text-green-800' :
                        machine.status === 'idle' ? 'bg-yellow-100 text-yellow-800' :
                        machine.status === 'maintenance' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {machine.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Location:</span>
                        <span className="font-medium">{machine.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Fuel Level:</span>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                machine.fuelLevel > 50 ? 'bg-green-500' : 
                                machine.fuelLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${machine.fuelLevel}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{machine.fuelLevel}%</span>
                        </div>
                      </div>
                      {machine.operator && (
                        <div className="flex items-center justify-between">
                          <span>Operator:</span>
                          <span className="font-medium">{machine.operator}</span>
                        </div>
                      )}
                      {machine.locationCoordinates && (
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Coordinates:</span>
                          <span>({machine.locationCoordinates.x}, {machine.locationCoordinates.y})</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Proximity-Based Task List - Enhanced */}
            {selectedOperator && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Nearest Tasks for {selectedOperator}
                </h3>
                
                {proximityTasks.length > 0 ? (
                  <div className="space-y-4">
                    {proximityTasks.map((task, index) => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="text-2xl mr-2">#{index + 1}</span>
                              <h4 className="font-semibold text-gray-800">{task.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2"> {task.location}</p>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority} priority
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              ⏱️ Est. {task.estimatedDuration}h • 🚜 {task.machine}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-blue-600">
                              {Math.round(task.distanceFromOperator || 0)}m
                            </div>
                            <div className="text-xs text-gray-500">distance</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">📋</div>
                    <div>No tasks assigned to this operator</div>
                    <div className="text-sm mt-1">Select an operator above to see nearby tasks</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PRIORITY 2: Real-Time Safety Monitoring */}
          <div className="xl:col-span-4">
            <SafetyAlerts />
          </div>

          {/* PRIORITY 3: Site Location Map */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3"> Site Overview</h3>
              <div className="h-96">
                <LocationMap
                  selectedOperator={selectedOperator}
                  onLocationClick={handleLocationClick}
                  onOperatorClick={handleOperatorClick}
                  onMachineClick={handleMachineClick}
                  showDistances={showDistances}
                />
              </div>
              
              {/* Quick Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-blue-50 rounded p-2">
                  <div className="font-bold text-blue-600">{operators.filter(o => o.status === 'active').length}</div>
                  <div className="text-gray-600">Active Operators</div>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <div className="font-bold text-green-600">{machines.filter(m => m.status === 'active').length}</div>
                  <div className="text-gray-600">Active Machines</div>
                </div>
                <div className="bg-orange-50 rounded p-2">
                  <div className="font-bold text-orange-600">10</div>
                  <div className="text-gray-600">Site Locations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Machines; 