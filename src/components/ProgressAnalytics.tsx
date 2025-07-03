import React from 'react';
import { Task } from '../data/mockData';

interface ProgressAnalyticsProps {
  tasks: Task[];
}

const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(t => t.status === 'done');
  const totalTimeSpent = tasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
  const avgTaskDuration = completedTasks.length > 0 
    ? completedTasks.reduce((sum, task) => sum + (task.actualDuration || 0), 0) / completedTasks.length 
    : 0;
  
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'done') return false;
    const dueTime = new Date(task.dueDate).getTime();
    return Date.now() > dueTime;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Progress Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-800">{completedTasks.length}</div>
          <div className="text-sm text-green-600">Tasks Completed</div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-800">{Math.round(totalTimeSpent / 60)}h</div>
          <div className="text-sm text-blue-600">Total Time Logged</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-800">{Math.round(avgTaskDuration * 10) / 10}h</div>
          <div className="text-sm text-purple-600">Avg Task Duration</div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-800">{overdueTasks.length}</div>
          <div className="text-sm text-red-600">Overdue Tasks</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {['0-25%', '26-50%', '51-75%', '76-100%'].map((range, index) => {
            const min = index * 25;
            const max = (index + 1) * 25;
            const count = tasks.filter(t => t.progress >= min && t.progress <= max).length;
            const percentage = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
            
            return (
              <div key={range} className="bg-gray-50 p-3 rounded-lg border">
                <div className="text-lg font-bold text-gray-800">{count}</div>
                <div className="text-sm text-gray-600">{range} Progress</div>
                <div className="text-xs text-gray-500">{percentage}% of tasks</div>
              </div>
            );
          })}
        </div>
      </div>

      {tasks.some(t => t.progressHistory?.length) && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Progress Updates</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
            {tasks
              .filter(t => t.progressHistory?.length)
              .flatMap(task => 
                (task.progressHistory || []).map(entry => ({
                  ...entry,
                  taskTitle: task.title,
                  taskId: task.id
                }))
              )
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 8)
              .map((entry, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {entry.taskTitle} - {entry.action ? entry.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Update'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.user || entry.updatedBy || 'System'} • {new Date(entry.timestamp).toLocaleString()}
                    </div>
                    {entry.notes && (
                      <div className="text-xs text-gray-600 mt-1">{entry.notes}</div>
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {entry.progress !== undefined ? `${entry.progress}%` : ''}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressAnalytics; 