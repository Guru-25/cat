import React, { useState } from 'react';
import { XMarkIcon, ClockIcon, MapPinIcon, TruckIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { type Task } from '../data/mockData';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdateProgress: (progress: number, notes?: string) => void;
  onUpdateStatus: (status: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ 
  task, 
  onClose, 
  onUpdateProgress,
  onUpdateStatus 
}) => {
  const [newProgress, setNewProgress] = useState(task.progress);
  const [progressNotes, setProgressNotes] = useState('');

  const getStatusBadgeClass = (status: string) => {
    const baseClasses = "status-badge";
    switch (status) {
      case 'pending': return `${baseClasses} status-pending`;
      case 'in-progress': return `${baseClasses} status-in-progress`;
      case 'done': return `${baseClasses} status-done`;
      case 'blocked': return `${baseClasses} status-blocked`;
      default: return baseClasses;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const handleProgressUpdate = () => {
    if (newProgress !== task.progress || progressNotes.trim()) {
      onUpdateProgress(newProgress, progressNotes.trim() || undefined);
      setProgressNotes('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()} PRIORITY
            </div>
            <span className={getStatusBadgeClass(task.status)}>
              {task.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Title and Description */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{task.title}</h2>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Assigned Operator</div>
                <div className="font-medium">{task.assignedOperator || 'Unassigned'}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <TruckIcon className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Machine</div>
                <div className="font-medium">{task.machine}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="font-medium">{task.location}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <ClockIcon className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Estimated Duration</div>
                <div className="font-medium">{task.estimatedDuration} hours</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Due Date</div>
                <div className="font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <ClockIcon className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Time Spent</div>
                <div className="font-medium">{task.timeSpent || 0} minutes</div>
              </div>
            </div>
          </div>

          {/* Current Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Current Progress</span>
              <span className="text-sm text-gray-600">{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Progress Update Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Update Progress</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="progress" className="block text-sm font-medium text-blue-900 mb-2">
                  Progress Percentage
                </label>
                <input
                  type="range"
                  id="progress"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-blue-700 mt-1">
                  <span>0%</span>
                  <span className="font-semibold">{newProgress}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-blue-900 mb-2">
                  Progress Notes (optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Add any notes about your progress..."
                />
              </div>

              <button
                onClick={handleProgressUpdate}
                disabled={newProgress === task.progress && !progressNotes.trim()}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Progress
              </button>
            </div>
          </div>

          {/* Status Update Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-3">Quick Status Update</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {task.status === 'pending' && (
                <button
                  onClick={() => onUpdateStatus('in-progress')}
                  className="px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 border border-blue-300 font-semibold transition-all duration-200"
                >
                  Start Task
                </button>
              )}
              
              {task.status === 'in-progress' && (
                <button
                  onClick={() => onUpdateStatus('done')}
                  className="px-3 py-2 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 border border-green-300 font-semibold transition-all duration-200"
                >
                  Mark Complete
                </button>
              )}
              
              {(task.status === 'pending' || task.status === 'in-progress') && (
                <button
                  onClick={() => onUpdateStatus('blocked')}
                  className="px-3 py-2 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 border border-red-300 font-semibold transition-all duration-200"
                >
                  Mark Blocked
                </button>
              )}
              
              {task.status === 'blocked' && (
                <button
                  onClick={() => onUpdateStatus('pending')}
                  className="px-3 py-2 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 border border-yellow-300 font-semibold transition-all duration-200"
                >
                  Unblock
                </button>
              )}
            </div>
          </div>

          {/* Progress History */}
          {task.progressHistory && task.progressHistory.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Progress History</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {task.progressHistory.slice().reverse().map((entry, index) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-white rounded border text-sm">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {entry.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className="text-gray-500 text-xs">
                        by {entry.user} • {new Date(entry.timestamp).toLocaleString()}
                      </div>
                      {entry.notes && (
                        <div className="text-gray-700 mt-1">{entry.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Guidelines */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">Safety Requirements</h3>
            <div className="text-red-800 text-sm space-y-1">
              <p>• Hard hat, safety vest, and steel-toed boots required</p>
              <p>• Ensure machine inspection is complete before operation</p>
              <p>• Maintain communication with site supervisor</p>
              <p>• Report any safety concerns immediately</p>
              <p>• Follow all CAT equipment operating procedures</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal; 