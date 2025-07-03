import React, { useState, useEffect } from 'react';
import VoiceAssistant from './VoiceAssistant';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  ArrowPathIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { Task, getQuickTimeEstimate, estimateTaskTime } from '../data/mockData';
import TaskModal from '../components/TaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import ProgressAnalytics from '../components/ProgressAnalytics';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showReassignDropdown, setShowReassignDropdown] = useState<string | null>(null);
  const [estimatingTasks, setEstimatingTasks] = useState<Set<number>>(new Set());

  // Get user info from localStorage
  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole') || 'operator';

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Simulate API call for time estimation
  const handleEstimateTime = async (task: Task) => {
    setEstimatingTasks(prev => new Set(prev).add(task.id));
    
    try {
      // Show a longer delay to simulate connecting to the Flask API
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // Simulate the Flask API call structure
      const apiData = {
        'Task': task.title.split(' ')[0], // Get task type (e.g., "Excavate")
        'Machine ID': task.machine.split(' ')[0] + '/' + (task.id.toString().padStart(3, '0')), // e.g., "CAT/001"
        'Operator': 'OP/' + (1000 + (task.assignedOperator?.length || 5)), // e.g., "OP/1005"
        'Units (e.g., cycles)': Math.ceil(Math.random() * 15) + 5, // 5-20 cycles
        'Avg. Time per Unit (min)': Math.ceil(Math.random() * 6) + 4 // 4-10 min per unit
      };

      // Log the API request to console for demonstration
      console.log('Sending request to PKL model API:', apiData);
      
      // Simulate another delay for the model processing time
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
      
      const estimatedTime = await estimateTaskTime(apiData);
      
      // Log the API response
      console.log('Received response from PKL model API:', estimatedTime);
      
      // Update task with estimated time
      const updatedTask = {
        ...task,
        estimatedDuration: estimatedTime / 60, // Convert to hours
        progressHistory: [
          ...(task.progressHistory || []),
          {
            timestamp: new Date().toISOString(),
            user: userName,
            action: 'time_estimated',
            notes: `AI estimated ${estimatedTime} minutes (${(estimatedTime/60).toFixed(1)} hours)`
          }
        ],
        lastUpdated: new Date().toISOString()
      };

      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? updatedTask : t)
      );

    } catch (error) {
      console.error('Time estimation failed:', error);
    } finally {
      setEstimatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
    }
  };

  // Filter tasks based on user role
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Role-based filtering
    if (userRole === 'operator') {
      filtered = tasks.filter(task => task.assignedOperator === userName);
    }

    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedOperator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.machine.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filtering
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Priority filtering
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'progressHistory' | 'timeSpent' | 'lastUpdated'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      createdAt: new Date().toISOString(),
      progressHistory: [{
        timestamp: new Date().toISOString(),
        user: userName,
        action: 'created',
        notes: 'Task created'
      }],
      timeSpent: 0,
      lastUpdated: new Date().toISOString()
    };
    
    setTasks([...tasks, newTask]);
    setShowCreateModal(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowCreateModal(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'progressHistory' | 'timeSpent' | 'lastUpdated'>) => {
    if (!editingTask) return;
    
    const updatedTask: Task = {
      ...editingTask,
      ...taskData,
      progressHistory: [
        ...(editingTask.progressHistory || []),
        {
          timestamp: new Date().toISOString(),
          user: userName,
          action: 'updated',
          notes: 'Task details updated'
        }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
    setEditingTask(null);
    setShowCreateModal(false);
  };

  const handleDeleteTask = (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleTaskClick = (task: Task) => {
    if (userRole === 'operator') {
      setSelectedTask(task);
      setShowDetailModal(true);
    }
  };

  const handleStatusUpdate = (taskId: number, newStatus: string, currentProgress: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const now = new Date().toISOString();
    let timeSpentIncrement = 0;
    
    // Calculate time spent if transitioning from in-progress
    if (task.status === 'in-progress' && newStatus !== 'in-progress') {
      const lastProgressEntry = (task.progressHistory || [])
        .filter(entry => entry.action === 'status_change')
        .reverse()
        .find(entry => entry.notes?.includes('in-progress'));
      
      if (lastProgressEntry) {
        const timeDiff = new Date(now).getTime() - new Date(lastProgressEntry.timestamp).getTime();
        timeSpentIncrement = Math.round(timeDiff / (1000 * 60)); // minutes
      }
    }

    const updatedTask: Task = {
      ...task,
      status: newStatus as 'pending' | 'in-progress' | 'done' | 'blocked',
      progress: newStatus === 'done' ? 100 : (newStatus === 'in-progress' ? Math.max(currentProgress, 10) : currentProgress),
      progressHistory: [
        ...(task.progressHistory || []),
        {
          timestamp: now,
          user: userName,
          action: 'status_change',
          notes: `Status changed to ${newStatus}`
        }
      ],
      timeSpent: (task.timeSpent || 0) + timeSpentIncrement,
      lastUpdated: now
    };
    
    setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
  };

  const handleReassignTask = (taskId: number, newOperator: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      assignedOperator: newOperator,
      progressHistory: [
        ...(task.progressHistory || []),
        {
          timestamp: new Date().toISOString(),
          user: userName,
          action: 'reassigned',
          notes: `Task reassigned to ${newOperator}`
        }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    setShowReassignDropdown(null);
  };

  const toggleReassignDropdown = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReassignDropdown(showReassignDropdown === taskId ? null : taskId);
  };

  const availableOperators = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson', 'Tom Brown'];

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
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userRole === 'admin' ? 'Task Management' : 'My Dashboard'}
            </h1>
            <p className="text-gray-600 mt-2">
              {userRole === 'admin' 
                ? 'Manage and assign tasks to operators' 
                : 'View your assigned tasks and update progress'
              }
            </p>
            <div className="mt-1 text-sm text-yellow-600 font-medium">
              Logged in as: {userName} ({userRole === 'admin' ? 'Administrator' : 'Operator'})
            </div>
          </div>

          {userRole === 'admin' && (
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create Task</span>
              </button>
              
              {/* Quick Stats for Admin */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <div className="text-xs font-medium text-blue-900">Quick Stats</div>
                <div className="text-sm text-blue-800">
                  {tasks.filter(t => !t.assignedOperator || t.assignedOperator === '').length} unassigned tasks
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show content only if we have tasks or filters/search */}
      {tasks.length > 0 && (
        <>
          {/* Filters and Search */}
          <div className="card mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks, operators, or descriptions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-yellow-400 focus:border-yellow-400"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center space-x-2">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-yellow-400 focus:border-yellow-400"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Task Statistics - Different for Admin vs Operator */}
          {userRole === 'admin' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {tasks.filter(t => t.status === 'done').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {tasks.filter(t => t.status === 'blocked').length}
                  </div>
                  <div className="text-sm text-gray-600">Blocked</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-blue-900">{filteredTasks.length}</div>
                  <div className="text-sm text-blue-700">My Tasks</div>
                </div>
              </div>
              <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-yellow-700">
                    {filteredTasks.filter(t => t.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-yellow-600">Active</div>
                </div>
              </div>
              <div className="card bg-gradient-to-br from-green-50 to-green-100">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-green-700">
                    {filteredTasks.filter(t => t.status === 'done').length}
                  </div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
              </div>
              <div className="card bg-gradient-to-br from-red-50 to-red-100">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-red-700">
                    {filteredTasks.filter(t => t.status === 'blocked').length}
                  </div>
                  <div className="text-sm text-red-600">Urgent</div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Analytics for Admin */}
          {userRole === 'admin' && (
            <div className="mb-6">
              <ProgressAnalytics tasks={tasks} />
            </div>
          )}

          {/* Task List */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-lg">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-yellow-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Operator
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Machine
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Est. Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr 
                      key={task.id} 
                      className="hover:bg-yellow-50 transition-colors duration-150 border-b border-gray-100 cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 hover:text-yellow-600 transition-colors">{task.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                          <ClockIcon className="h-4 w-4 ml-3 mr-1" />
                          {task.timeSpent || 0}m logged
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {task.assignedOperator ? (
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
                              <UserIcon className="h-4 w-4 text-black" />
                            </div>
                            <span className="text-sm text-gray-900">{task.assignedOperator}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadgeClass(task.status)}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-3 mr-3 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500 ease-out"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-700 font-semibold">{task.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <TruckIcon className="h-4 w-4 text-yellow-600 mr-2" />
                          <span className="text-sm text-gray-700">{task.machine}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BoltIcon className="h-4 w-4 text-yellow-600 mr-2" />
                          {task.estimatedDuration ? (
                            <span className="text-sm font-medium text-yellow-700">
                              {(task.estimatedDuration).toFixed(1)}h
                            </span>
                          ) : (
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 mr-2">
                                ~{getQuickTimeEstimate(task).toFixed(1)}h
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEstimateTime(task);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                                disabled={estimatingTasks.has(task.id)}
                              >
                                {estimatingTasks.has(task.id) ? (
                                  <>
                                    <ArrowPathIcon className="h-3 w-3 mr-1 animate-spin" />
                                    Calculating...
                                  </>
                                ) : (
                                  <>AI Estimated</>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          {userRole === 'admin' ? (
                            <>
                              {/* Admin Actions */}
                              <div className="relative">
                                <button
                                  onClick={(e) => toggleReassignDropdown(task.id.toString(), e)}
                                  className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                                  title="Reassign Task"
                                >
                                  <ArrowPathIcon className="h-4 w-4" />
                                </button>
                                {showReassignDropdown === task.id.toString() && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                                    {availableOperators.map((operator) => (
                                      <button
                                        key={operator}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleReassignTask(task.id, operator);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        {operator}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTask(task);
                                }}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="Edit Task"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task.id);
                                }}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Delete Task"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Operator Actions */}
                              {task.status === 'pending' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(task.id, 'in-progress', task.progress);
                                  }}
                                  className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 border border-yellow-300 font-semibold transition-all duration-200"
                                  title="Start Task"
                                >
                                  Start
                                </button>
                              )}
                              {task.status === 'in-progress' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(task.id, 'done', task.progress);
                                  }}
                                  className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-lg hover:bg-green-200 border border-green-300 font-semibold transition-all duration-200"
                                  title="Complete Task"
                                >
                                  Done
                                </button>
                              )}
                              {(task.status === 'pending' || task.status === 'in-progress') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(task.id, 'blocked', task.progress);
                                  }}
                                  className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-lg hover:bg-red-200 border border-red-300 font-semibold transition-all duration-200"
                                  title="Block Task"
                                >
                                  Block
                                </button>
                              )}
                              <span className="text-xs text-gray-500 italic">Click row for details</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTasks.length === 0 && tasks.length > 0 && (
              <div className="text-center py-12">
                <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Empty state when no tasks */}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500">
            {userRole === 'admin' 
              ? 'Create your first task to get started.' 
              : 'No tasks assigned to you yet.'
            }
          </p>
          {userRole === 'admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 btn-primary"
            >
              Create First Task
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <TaskModal
          task={editingTask}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={() => {
            setShowCreateModal(false);
            setEditingTask(null);
          }}
        />
      )}

      {showDetailModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTask(null);
          }}
          onUpdateProgress={(progress, notes) => {
            if (selectedTask) {
              const updatedTask: Task = {
                ...selectedTask,
                progress,
                progressHistory: [
                  ...(selectedTask.progressHistory || []),
                  {
                    timestamp: new Date().toISOString(),
                    user: userName,
                    action: 'progress_update',
                    notes: notes || `Progress updated to ${progress}%`
                  }
                ],
                lastUpdated: new Date().toISOString()
              };
              
              setTasks(tasks.map(t => t.id === selectedTask.id ? updatedTask : t));
              setSelectedTask(updatedTask);
            }
          }}
          onUpdateStatus={(newStatus) => {
            if (selectedTask) {
              handleStatusUpdate(selectedTask.id, newStatus, selectedTask.progress);
              const updatedTask = tasks.find(t => t.id === selectedTask.id);
              if (updatedTask) {
                setSelectedTask({...updatedTask, status: newStatus as 'pending' | 'in-progress' | 'done' | 'blocked'});
              }
            }
          }}
        />
      )}
       
    {/* ...your existing UI... */}
    <div style={{ position: 'fixed', bottom: 34, right: 12, zIndex: 1000 }}>
      <VoiceAssistant />
    </div>

    </div>
  );
};

export default Tasks; 