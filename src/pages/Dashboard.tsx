import React from 'react';
import { ChartBarIcon, UserGroupIcon, TruckIcon, ClockIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  // Mock data for the dashboard
  const stats = [
    { name: 'Active Operators', value: '12', icon: UserGroupIcon, change: '+2', changeType: 'positive' },
    { name: 'Active Machines', value: '8', icon: TruckIcon, change: '-1', changeType: 'negative' },
    { name: 'Tasks Completed', value: '24', icon: ChartBarIcon, change: '+8', changeType: 'positive' },
    { name: 'Hours Worked', value: '96', icon: ClockIcon, change: '+12', changeType: 'positive' },
  ];

  const activeTasks = [
    { id: 1, title: 'Excavate Foundation Site A', operator: 'Gururaja', machine: 'CAT 336F', progress: 75 },
    { id: 2, title: 'Clear Debris from Road', operator: 'Akash', machine: 'CAT D6T', progress: 45 },
    { id: 3, title: 'Grade Construction Zone', operator: 'Bala', machine: 'CAT 140M3', progress: 90 },
  ];

  const machines = [
    { id: 1, model: 'CAT 336F Excavator', status: 'Active', operator: 'Gururaja', fuel: 85 },
    { id: 2, model: 'CAT D6T Bulldozer', status: 'Active', operator: 'Akash', fuel: 62 },
    { id: 3, model: 'CAT 140M3 Grader', status: 'Active', operator: 'Bala', fuel: 78 },
    { id: 4, model: 'CAT 725C Truck', status: 'Maintenance', operator: '-', fuel: 45 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor real-time operations and performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Tasks */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Tasks</h3>
          <div className="space-y-4">
            {activeTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.operator} • {task.machine}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <div className="mt-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Machine Status</h3>
          <div className="space-y-4">
            {machines.map((machine) => (
              <div key={machine.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{machine.model}</h4>
                  <p className="text-sm text-gray-600">
                    Operator: {machine.operator}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`status-badge ${
                      machine.status === 'Active' ? 'status-in-progress' :
                      machine.status === 'Maintenance' ? 'status-blocked' : 'status-pending'
                    }`}>
                      {machine.status}
                    </span>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">Fuel:</span>
                      <span className={`ml-1 font-medium ${
                        machine.fuel > 70 ? 'text-green-600' :
                        machine.fuel > 30 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {machine.fuel}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 