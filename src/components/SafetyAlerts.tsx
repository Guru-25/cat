import React, { useState, useEffect, useRef } from 'react';
import { 
  getOperators, 
  getMachines, 
  calculateDistance,
  Operator, 
  Machine 
} from '../data/mockData';

interface SafetyAlert {
  id: string;
  type: 'proximity' | 'hazard_zone' | 'emergency' | 'fatigue';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  operator: string;
  machine?: string;
  distance?: number;
  safetyRadius?: number;
  message: string;
  timestamp: string;
  coordinates: { x: number; y: number };
}

// Safety configuration
const SAFETY_ZONES = {
  excavator: 15,    // 15-meter safety radius
  bulldozer: 12,    // 12-meter safety radius
  truck: 8,         // 8-meter safety radius
  loader: 10        // 10-meter safety radius
};

const HAZARD_ZONES = [
  {
    name: "Blasting Zone",
    coordinates: { x: 350, y: 250 },
    radius: 50,
    severity: "CRITICAL" as const,
    description: "Active blasting area - immediate evacuation required"
  },
  {
    name: "Crane Operation Zone", 
    coordinates: { x: 200, y: 300 },
    radius: 25,
    severity: "HIGH" as const,
    description: "Heavy lifting in progress - maintain safe distance"
  },
  {
    name: "Chemical Storage",
    coordinates: { x: 75, y: 150 },
    radius: 20,
    severity: "MEDIUM" as const,
    description: "Hazardous materials - PPE required"
  }
];

const SafetyAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [activeAlertConditions, setActiveAlertConditions] = useState<Set<string>>(new Set());
  
  // Audio ref to control playback
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/alarm.mp3');
    audioRef.current.preload = 'auto';
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setOperators(getOperators());
    setMachines(getMachines());
  }, []);

  useEffect(() => {
    if (monitoringActive) {
      const interval = setInterval(() => {
        checkSafetyAlerts();
      }, 2000); // Check every 2 seconds

      return () => clearInterval(interval);
    }
  }, [monitoringActive, operators, machines]);

  // Audio playback function
  const playAlarmSound = (severity: string, alertType: string) => {
    if (!audioEnabled || !audioRef.current) return;

    try {
      // Reset audio to beginning
      audioRef.current.currentTime = 0;
      
      // Adjust volume based on severity
      switch (severity) {
        case 'CRITICAL':
          audioRef.current.volume = 1.0;
          // Play alarm 3 times for critical alerts
          audioRef.current.play();
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            }
          }, 1500);
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            }
          }, 3000);
          break;
        case 'HIGH':
          audioRef.current.volume = 0.8;
          // Play alarm 2 times for high alerts
          audioRef.current.play();
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            }
          }, 1500);
          break;
        case 'MEDIUM':
          audioRef.current.volume = 0.6;
          audioRef.current.play();
          break;
        case 'LOW':
          audioRef.current.volume = 0.4;
          audioRef.current.play();
          break;
        default:
          audioRef.current.volume = 0.5;
          audioRef.current.play();
      }
      
      console.log(`🔊 Safety Alert Audio: ${severity} ${alertType} alert triggered`);
    } catch (error) {
      console.error('Failed to play alarm sound:', error);
    }
  };

  const checkSafetyAlerts = () => {
    const newAlerts: SafetyAlert[] = [];
    const currentConditions = new Set<string>();
    const currentOperators = getOperators();
    const currentMachines = getMachines();
    const newAudioAlerts: SafetyAlert[] = [];

    // Check proximity to active machines
    currentOperators.forEach(operator => {
      if (operator.currentLocation && operator.status === 'active') {
        currentMachines.forEach(machine => {
          if (machine.status === 'active' && machine.locationCoordinates) {
            // Skip if this is the operator's own machine
            if (machine.operator === operator.name || operator.currentMachine === machine.model) {
              return;
            }

            const distance = calculateDistance(
              operator.currentLocation,
              machine.locationCoordinates
            );

            const safetyRadius = SAFETY_ZONES[machine.type as keyof typeof SAFETY_ZONES] || 10;

            if (distance < safetyRadius) {
              const severity = distance < safetyRadius * 0.5 ? 'CRITICAL' : 'HIGH';
              
              // Create a unique condition identifier (without timestamp)
              const conditionId = `proximity-${operator.id}-${machine.id}`;
              currentConditions.add(conditionId);
              
              const alert: SafetyAlert = {
                id: `${conditionId}-${Date.now()}`,
                type: 'proximity',
                severity,
                operator: operator.name,
                machine: machine.model,
                distance: Math.round(distance),
                safetyRadius,
                message: `${operator.name} too close to ${machine.model} (${Math.round(distance)}m, ${safetyRadius}m required)`,
                timestamp: new Date().toLocaleTimeString(),
                coordinates: operator.currentLocation
              };
              
              newAlerts.push(alert);
              
              // If this is a NEW condition (not previously active), add to audio alerts
              if (!activeAlertConditions.has(conditionId)) {
                newAudioAlerts.push(alert);
              }
            }
          }
        });

        // Check hazard zones
        HAZARD_ZONES.forEach(zone => {
          const distance = calculateDistance(
            operator.currentLocation,
            zone.coordinates
          );

          if (distance < zone.radius) {
            // Create a unique condition identifier (without timestamp)
            const conditionId = `hazard-${operator.id}-${zone.name}`;
            currentConditions.add(conditionId);
            
            const alert: SafetyAlert = {
              id: `${conditionId}-${Date.now()}`,
              type: 'hazard_zone',
              severity: zone.severity,
              operator: operator.name,
              message: `${operator.name} entered ${zone.name} (${zone.description})`,
              timestamp: new Date().toLocaleTimeString(),
              coordinates: operator.currentLocation
            };
            
            newAlerts.push(alert);
            
            // If this is a NEW condition (not previously active), add to audio alerts
            if (!activeAlertConditions.has(conditionId)) {
              newAudioAlerts.push(alert);
            }
          }
        });
      }
    });

    // Update active conditions
    setActiveAlertConditions(currentConditions);

    // Play audio only for NEW alert conditions
    if (newAudioAlerts.length > 0) {
      // Play alarm for the highest severity new alert
      const highestSeverityAlert = newAudioAlerts.reduce((prev, current) => {
        const severityOrder = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4 };
        return severityOrder[current.severity as keyof typeof severityOrder] > 
               severityOrder[prev.severity as keyof typeof severityOrder] ? current : prev;
      });
      
      playAlarmSound(highestSeverityAlert.severity, highestSeverityAlert.type);
      
      // Log the alert trigger
      console.log(` NEW SAFETY ALERT: ${highestSeverityAlert.severity} - ${highestSeverityAlert.message}`);
    }

    // Log resolved conditions
    const resolvedConditions = Array.from(activeAlertConditions).filter(
      condition => !currentConditions.has(condition)
    );
    if (resolvedConditions.length > 0) {
      console.log(` SAFETY ALERT RESOLVED: ${resolvedConditions.length} condition(s) cleared`);
    }

    // Update alerts display (keep recent alerts for reference)
    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep last 10 alerts
    } else if (alerts.length > 0 && currentConditions.size === 0) {
      // Clear old alerts if no active conditions
      setAlerts([]);
    }
  };

  const dismissAlert = (alertId: string) => {
    // Find the alert being dismissed to extract its condition ID
    const alertBeingDismissed = alerts.find(alert => alert.id === alertId);
    if (alertBeingDismissed) {
      // Extract condition ID from alert ID (remove timestamp part)
      const conditionId = alertId.replace(/-\d+$/, '');
      
      // Remove from active conditions so new alerts can trigger for this condition
      setActiveAlertConditions(prev => {
        const newSet = new Set(prev);
        newSet.delete(conditionId);
        return newSet;
      });
      
      console.log(`👤 Alert manually dismissed: ${conditionId}`);
    }
    
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleEmergencyResponse = (alert: SafetyAlert) => {
    if (alert.type === 'proximity' && alert.machine) {
      // Simulate emergency machine shutdown
      const machines = getMachines();
      const updatedMachines = machines.map(machine => 
        machine.model === alert.machine 
          ? { ...machine, status: 'emergency_stop' as any }
          : machine
      );
      localStorage.setItem('machines', JSON.stringify(updatedMachines));
      
      // Add emergency response log
      const emergencyLog = {
        timestamp: new Date().toISOString(),
        action: 'EMERGENCY_MACHINE_STOP',
        operator: alert.operator,
        machine: alert.machine,
        distance: alert.distance,
        responseTime: '< 5 seconds'
      };
      
      window.alert(` EMERGENCY RESPONSE ACTIVATED:
      
 ${alert.machine} STOPPED immediately
 Safety alert cleared
 Emergency response logged
 ${alert.operator} notified to evacuate area

Response Time: < 5 seconds
Next: Safety officer dispatched to coordinates (${alert.coordinates.x}, ${alert.coordinates.y})`);
      
      // Clear the specific alert
      dismissAlert(alert.id);
      
      // Force page refresh to show machine status change
      window.location.reload();
    } else if (alert.type === 'hazard_zone') {
      // Simulate hazard zone evacuation
      window.alert(` HAZARD ZONE EVACUATION PROTOCOL:

 All personnel evacuating hazard zone
 Safety barriers activated  
 Emergency team dispatched
 ${alert.operator} guided to nearest exit

Evacuation Route: → Safety Station (200, 100)
Estimated evacuation time: 3 minutes`);
      
      dismissAlert(alert.id);
    }
  };

  const moveOperatorToSafety = (alert: SafetyAlert) => {
    // Find the operator and move them to safety station
    const operators = getOperators();
    const operator = operators.find(op => op.name === alert.operator);
    
    if (operator) {
      const safetyStationCoords = { x: 200, y: 100, zone: 'central' };
      const updatedOperators = operators.map(op => 
        op.name === alert.operator 
          ? { ...op, currentLocation: safetyStationCoords, lastLocationUpdate: new Date().toISOString() }
          : op
      );
      localStorage.setItem('operators', JSON.stringify(updatedOperators));
      
      window.alert(` SAFETY PROTOCOL EXECUTED:

${alert.operator} moved to Safety Station
Distance from hazard: SAFE
Location: Safety Station (200, 100)
Status: Secured

Alert automatically cleared.`);
      
      dismissAlert(alert.id);
      
      // Force page refresh to show position change
      window.location.reload();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 border-red-500 text-red-800';
      case 'HIGH': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'LOW': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '';
      case 'HIGH': return '';
      case 'MEDIUM': return '';
      case 'LOW': return 'ℹ';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'proximity': return '';
      case 'hazard_zone': return '☢️';
      case 'emergency': return '🆘';
      case 'fatigue': return '😴';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Real-Time Safety Monitoring
        </h3>
        <div className="flex items-center space-x-3">
          <span className={`text-sm ${monitoringActive ? 'text-green-600' : 'text-gray-500'}`}>
            {monitoringActive ? 'Monitoring Active' : 'Monitoring Off'}
          </span>
          
          {/* Audio Control */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`px-2 py-1 rounded-md text-sm font-medium ${
              audioEnabled 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            title={audioEnabled ? 'Disable audio alerts' : 'Enable audio alerts'}
          >
            {audioEnabled ? '🔊' : '🔇'}
          </button>
          
          <button
            onClick={() => {
              const newState = !monitoringActive;
              setMonitoringActive(newState);
              if (!newState) {
                // Clear active conditions when stopping monitoring
                setActiveAlertConditions(new Set());
                console.log('🛑 Monitoring stopped - alert conditions cleared');
              }
            }}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              monitoringActive 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {monitoringActive ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>
      </div>

      {/* Safety Configuration Display */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Active Safety Zones</h4>
          <div className="flex items-center space-x-2 text-xs">
            <span className={`px-2 py-1 rounded ${
              audioEnabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {audioEnabled ? '🔊 Audio Alerts ON' : '🔇 Audio Alerts OFF'}
            </span>
            <span className="text-gray-500">
              Check interval: 2s
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div>
            <div className="font-medium">Machine Safety Radii:</div>
            <ul className="text-gray-600 ml-2">
              <li>Excavator: {SAFETY_ZONES.excavator}m</li>
              <li>Bulldozer: {SAFETY_ZONES.bulldozer}m</li>
              <li>Truck: {SAFETY_ZONES.truck}m</li>
              <li>Loader: {SAFETY_ZONES.loader}m</li>
            </ul>
          </div>
          <div>
            <div className="font-medium">Hazard Zones:</div>
            <ul className="text-gray-600 ml-2">
              {HAZARD_ZONES.map((zone, index) => (
                <li key={index}>
                  {getSeverityIcon(zone.severity)} {zone.name}: {zone.radius}m
                </li>
              ))}
            </ul>
          </div>
        </div>
        
                 {/* Audio Alert Patterns */}
         {audioEnabled && (
           <div className="mt-2 pt-2 border-t border-gray-200">
             <div className="flex items-center justify-between">
               <div className="text-xs text-gray-600">
                 <span className="font-medium">Audio Alert Patterns:</span>
                 <span className="ml-2">Critical: 3x alarms | High: 2x alarms | Medium/Low: 1x alarm</span>
               </div>
               <button
                 onClick={() => playAlarmSound('HIGH', 'test')}
                 className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
               >
                 🔊 Test Audio
               </button>
             </div>
           </div>
         )}
      </div>

      {/* Active Alerts */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {monitoringActive ? (
              <div>
                <div className="text-2xl mb-2"></div>
                <div>No safety alerts - All operators in safe zones</div>
              </div>
            ) : (
              <div>
                <div className="text-2xl mb-2"></div>
                <div>Start monitoring to track safety alerts</div>
                <div className="text-xs mt-1">System will check proximity to machines and hazard zones</div>
              </div>
            )}
          </div>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              className={`border-l-4 p-3 rounded-r-lg ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-lg mr-2">
                      {getSeverityIcon(alert.severity)}
                    </span>
                    <span className="text-lg mr-2">
                      {getTypeIcon(alert.type)}
                    </span>
                    <span className="font-medium text-sm">
                      {alert.severity} ALERT
                    </span>
                    <span className="ml-2 text-xs text-gray-600">
                      {alert.timestamp}
                    </span>
                  </div>
                  <div className="text-sm mb-1">
                    {alert.message}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                     Coordinates: ({alert.coordinates.x}, {alert.coordinates.y})
                    {alert.distance && alert.safetyRadius && (
                      <span className="ml-2">
                        | Distance: {alert.distance}m (Safe: {alert.safetyRadius}m)
                      </span>
                    )}
                  </div>
                  
                  {/* Emergency Action Buttons */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {alert.severity === 'CRITICAL' && (
                      <button
                        onClick={() => handleEmergencyResponse(alert)}
                        className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                      >
                         EMERGENCY STOP
                      </button>
                    )}
                    <button
                      onClick={() => moveOperatorToSafety(alert)}
                      className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      🏃 Move to Safety
                    </button>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                       Acknowledge
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {alerts.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setAlerts([]);
                  setActiveAlertConditions(new Set());
                  console.log('🧹 All alerts cleared manually');
                }}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');
                  if (criticalAlerts.length > 0) {
                    alert(`${criticalAlerts.length} CRITICAL safety alert(s) require immediate attention!`);
                  }
                }}
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                disabled={!alerts.some(a => a.severity === 'CRITICAL')}
              >
                Emergency Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyAlerts; 