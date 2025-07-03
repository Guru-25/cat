import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { initializeMockData } from './data/mockData';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Operators from './pages/Operators';
import Machines from './pages/Machines';
import Safety from './pages/Safety';
import ELearning from './pages/ELearning';
import Login from './pages/Login';

function App() {
  useEffect(() => {
    // Initialize mock data in localStorage
    initializeMockData();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <div className="flex flex-col h-screen">
              <Navbar />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/operators" element={<Operators />} />
                  <Route path="/machines" element={<Machines />} />
                  <Route path="/safety" element={<Safety />} />
                  <Route path="/elearning" element={<ELearning />} />
                </Routes>
              </main>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 