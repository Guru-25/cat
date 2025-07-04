import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { type Task } from '../data/mockData';

interface TaskModalProps {
  task?: Task | null;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'progressHistory' | 'timeSpent' | 'lastUpdated'>) => void;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedOperator: '',
    machine: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedDuration: 0,
    location: '',
    locationCoordinates: { x: 0, y: 0 },
    status: 'pending' as 'pending' | 'in-progress' | 'done' | 'blocked',
    dueDate: '',
    progress: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [useManualEstimate, setUseManualEstimate] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);

  // Available operators and machines
  const availableOperators = ['Gururaja', 'Akash', 'Bala', 'Lisa Wilson', 'Tom Brown'];
  const availableMachines = ['CAT 320', 'CAT 330', 'CAT 349', 'CAT 950', 'CAT 980'];

  useEffect(() => {
    if (task) {
      // Editing existing task
      setFormData({
        title: task.title,
        description: task.description,
        assignedOperator: task.assignedOperator || '',
        machine: task.machine,
        priority: task.priority,
        estimatedDuration: task.estimatedDuration || 0,
        location: task.location,
        locationCoordinates: task.locationCoordinates || { x: 0, y: 0 },
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : new Date().toISOString().split('T')[0], // Extract date part or use today
        progress: task.progress
      });
      setUseManualEstimate(!!task.estimatedDuration);
    } else {
      // Creating new task - set default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        title: '',
        description: '',
        assignedOperator: '',
        machine: '',
        priority: 'medium',
        estimatedDuration: 0,
        location: '',
        locationCoordinates: { x: 0, y: 0 },
        status: 'pending',
        dueDate: tomorrow.toISOString().split('T')[0],
        progress: 0
      });
      setUseManualEstimate(false);
    }
    setErrors({});
  }, [task]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }

    if (!formData.assignedOperator) {
      newErrors.assignedOperator = 'Operator assignment is required';
    }

    if (!formData.machine) {
      newErrors.machine = 'Machine assignment is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // If using auto-estimate, simulate API call to PKL model
    if (!useManualEstimate) {
      setIsEstimating(true);
      
      // Simulate API call delay (1-2 seconds)
      setTimeout(() => {
        const taskData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          assignedOperator: formData.assignedOperator,
          machine: formData.machine,
          priority: formData.priority,
          estimatedDuration: 0, // Will be auto-estimated by the system
          location: formData.location.trim(),
          locationCoordinates: formData.locationCoordinates,
          status: formData.status,
          dueDate: new Date(formData.dueDate).toISOString(),
          progress: formData.progress
        };
        
        setIsEstimating(false);
        onSave(taskData);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
      
      return;
    }

    // For manual estimate, proceed immediately
    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignedOperator: formData.assignedOperator,
      machine: formData.machine,
      priority: formData.priority,
      estimatedDuration: useManualEstimate ? formData.estimatedDuration : 0,
      location: formData.location.trim(),
      locationCoordinates: formData.locationCoordinates,
      status: formData.status,
      dueDate: new Date(formData.dueDate).toISOString(),
      progress: formData.progress
    };

    onSave(taskData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter task title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe the task in detail"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Row 1: Operator and Machine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="operator" className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Operator *
              </label>
              <select
                id="operator"
                value={formData.assignedOperator}
                onChange={(e) => handleInputChange('assignedOperator', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400 ${
                  errors.assignedOperator ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select an operator</option>
                {availableOperators.map((operator) => (
                  <option key={operator} value={operator}>
                    {operator}
                  </option>
                ))}
              </select>
              {errors.assignedOperator && <p className="mt-1 text-sm text-red-600">{errors.assignedOperator}</p>}
            </div>

            <div>
              <label htmlFor="machine" className="block text-sm font-medium text-gray-700 mb-2">
                Machine *
              </label>
              <select
                id="machine"
                value={formData.machine}
                onChange={(e) => handleInputChange('machine', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400 ${
                  errors.machine ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a machine</option>
                {availableMachines.map((machine) => (
                  <option key={machine} value={machine}>
                    {machine}
                  </option>
                ))}
              </select>
              {errors.machine && <p className="mt-1 text-sm text-red-600">{errors.machine}</p>}
            </div>
          </div>

          {/* Row 2: Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* Row 3: Duration and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Duration (hours)
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="useManualEstimate"
                  checked={useManualEstimate}
                  onChange={(e) => setUseManualEstimate(e.target.checked)}
                  className="mr-2 h-4 w-4 text-yellow-500 focus:ring-yellow-400"
                />
                <label htmlFor="useManualEstimate" className="text-sm text-gray-600">
                  Specify manually (leave unchecked for auto-estimate)
                </label>
              </div>
              {useManualEstimate ? (
                <input
                  type="number"
                  id="estimatedDuration"
                  min="0.5"
                  step="0.5"
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange('estimatedDuration', parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400 ${
                    errors.estimatedDuration ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter estimated hours"
                />
              ) : (
                <div className="text-sm text-gray-500 italic border border-gray-200 bg-gray-50 px-3 py-2 rounded-lg flex items-center">
                  <span>AI Estimated</span>
                  {isEstimating && (
                    <div className="ml-2 flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-yellow-500 rounded-full border-t-transparent"></div>
                      <span className="ml-2 text-yellow-600">Connecting to model...</span>
                    </div>
                  )}
                </div>
              )}
              {errors.estimatedDuration && <p className="mt-1 text-sm text-red-600">{errors.estimatedDuration}</p>}
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400 ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400 ${
                errors.location ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter work location"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Progress (only show when editing) */}
          {task && (
            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-2">
                Progress (%)
              </label>
              <input
                type="number"
                id="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleInputChange('progress', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEstimating}
              className={`px-4 py-2 bg-yellow-500 rounded-lg text-white hover:bg-yellow-600 transition-colors flex items-center ${
                isEstimating ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isEstimating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                  Estimating...
                </>
              ) : (
                task ? 'Update Task' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal; 