import React, { useState, useEffect } from 'react';
import { 
  getOperators, 
  getMachines, 
  getSiteLocations, 
  Coordinates, 
  Location, 
  Operator, 
  Machine 
} from '../data/mockData';

interface LocationMapProps {
  selectedOperator?: string;
  onLocationClick?: (location: Location) => void;
  onOperatorClick?: (operator: Operator) => void;
  onMachineClick?: (machine: Machine) => void;
  showDistances?: boolean;
}

const LocationMap: React.FC<LocationMapProps> = ({ 
  selectedOperator, 
  onLocationClick, 
  onOperatorClick, 
  onMachineClick,
  showDistances = false 
}) => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    setOperators(getOperators());
    setMachines(getMachines());
    setLocations(getSiteLocations());
  }, []);

  // Map dimensions and scaling
  const mapWidth = 450;
  const mapHeight = 450;
  const maxCoordX = 400;
  const maxCoordY = 400;

  const scaleX = (x: number) => (x / maxCoordX) * mapWidth;
  const scaleY = (y: number) => (y / maxCoordY) * mapHeight;

  const getLocationTypeColor = (type: Location['type']) => {
    switch (type) {
      case 'construction': return 'bg-orange-500';
      case 'storage': return 'bg-blue-500';
      case 'office': return 'bg-green-500';
      case 'maintenance': return 'bg-red-500';
      case 'parking': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getOperatorStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 border-green-300';
      case 'break': return 'bg-yellow-600 border-yellow-300';
      case 'offline': return 'bg-gray-600 border-gray-300';
      default: return 'bg-blue-600 border-blue-300';
    }
  };

  const getMachineStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-700 border-green-400';
      case 'idle': return 'bg-yellow-700 border-yellow-400';
      case 'maintenance': return 'bg-red-700 border-red-400';
      case 'offline': return 'bg-gray-700 border-gray-400';
      default: return 'bg-blue-700 border-blue-400';
    }
  };

  const selectedOp = operators.find(op => op.name === selectedOperator);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2"> Site Location Map</h3>
        <div className="text-sm text-gray-600">
          Real-time positions of operators, machines, and work locations
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="font-medium mb-2">Operators</div>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-600 border-2 border-green-300 mr-2"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-600 border-2 border-yellow-300 mr-2"></div>
              <span>Break</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-600 border-2 border-gray-300 mr-2"></div>
              <span>Offline</span>
            </div>
          </div>
        </div>
        <div>
          <div className="font-medium mb-2">Locations</div>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-orange-500 mr-2"></div>
              <span>Construction</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-blue-500 mr-2"></div>
              <span>Storage</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-green-500 mr-2"></div>
              <span>Office</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-red-500 mr-2"></div>
              <span>Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
        <svg width={mapWidth} height={mapHeight} className="block">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Zone labels */}
          <text x="50" y="30" className="fill-gray-500 text-xs font-medium">WEST</text>
          <text x={mapWidth/2 - 20} y="30" className="fill-gray-500 text-xs font-medium">CENTRAL</text>
          <text x={mapWidth - 50} y="30" className="fill-gray-500 text-xs font-medium">EAST</text>
          <text x="50" y={mapHeight/2} className="fill-gray-500 text-xs font-medium">NORTH</text>
          <text x="50" y={mapHeight - 20} className="fill-gray-500 text-xs font-medium">SOUTH</text>

          {/* Site locations */}
          {locations.map((location, index) => (
            <g key={index}>
              <rect
                x={scaleX(location.coordinates.x) - 15}
                y={scaleY(location.coordinates.y) - 10}
                width="30"
                height="20"
                className={`${getLocationTypeColor(location.type)} opacity-60 cursor-pointer hover:opacity-80`}
                rx="3"
                onClick={() => onLocationClick?.(location)}
              />
              <text
                x={scaleX(location.coordinates.x)}
                y={scaleY(location.coordinates.y)}
                className="fill-white text-xs font-bold text-center"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: '8px' }}
              >
                {location.name.split(' ')[0]}
              </text>
            </g>
          ))}

          {/* Machines */}
          {machines.filter(machine => machine.locationCoordinates).map((machine) => (
            <g key={machine.id}>
              <rect
                x={scaleX(machine.locationCoordinates.x) - 8}
                y={scaleY(machine.locationCoordinates.y) - 8}
                width="16"
                height="16"
                className={`${getMachineStatusColor(machine.status)} cursor-pointer hover:opacity-80`}
                rx="2"
                onClick={() => onMachineClick?.(machine)}
              />
              <text
                x={scaleX(machine.locationCoordinates.x)}
                y={scaleY(machine.locationCoordinates.y) + 20}
                className="fill-gray-700 text-xs"
                textAnchor="middle"
                style={{ fontSize: '9px' }}
              >
                {machine.model.split(' ')[1]}
              </text>
            </g>
          ))}

          {/* Operators */}
          {operators.filter(operator => operator.currentLocation).map((operator) => (
            <g key={operator.id}>
              <circle
                cx={scaleX(operator.currentLocation.x)}
                cy={scaleY(operator.currentLocation.y)}
                r="8"
                className={`${getOperatorStatusColor(operator.status)} cursor-pointer hover:opacity-80 ${
                  selectedOperator === operator.name ? 'ring-4 ring-blue-400' : ''
                }`}
                onClick={() => onOperatorClick?.(operator)}
              />
              <text
                x={scaleX(operator.currentLocation.x)}
                y={scaleY(operator.currentLocation.y) - 15}
                className={`fill-gray-800 text-xs font-medium ${
                  selectedOperator === operator.name ? 'font-bold' : ''
                }`}
                textAnchor="middle"
                style={{ fontSize: '10px' }}
              >
                {operator.name.split(' ')[0]}
              </text>
            </g>
          ))}

          {/* Distance lines for selected operator */}
          {showDistances && selectedOp && locations.map((location, index) => (
            <line
              key={`distance-${index}`}
              x1={scaleX(selectedOp.currentLocation.x)}
              y1={scaleY(selectedOp.currentLocation.y)}
              x2={scaleX(location.coordinates.x)}
              y2={scaleY(location.coordinates.y)}
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="3,3"
              opacity="0.5"
            />
          ))}
        </svg>

        {/* Coordinates display */}
        {selectedOp && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs">
            <div className="font-medium">{selectedOp.name}</div>
            <div className="text-gray-600">
              ({selectedOp.currentLocation.x}, {selectedOp.currentLocation.y})
            </div>
          </div>
        )}
      </div>

      {/* Status Summary */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="font-medium text-gray-800">Operators</div>
          <div className="text-2xl font-bold text-blue-600">{operators.length}</div>
          <div className="text-gray-500">
            {operators.filter(op => op.status === 'active').length} active
          </div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-800">Machines</div>
          <div className="text-2xl font-bold text-green-600">{machines.length}</div>
          <div className="text-gray-500">
            {machines.filter(m => m.status === 'active').length} active
          </div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-800">Locations</div>
          <div className="text-2xl font-bold text-orange-600">{locations.length}</div>
          <div className="text-gray-500">
            {locations.filter(l => l.type === 'construction').length} construction
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap; 