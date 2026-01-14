import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSocket } from './hooks/useSocket';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gigs from './pages/Gigs';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateGig from './pages/CreateGig';
import GigDetails from './pages/GigDetails';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  useSocket(); // Real-time notifications enabled globally

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-primary selection:text-white flex flex-col">
        <Navbar />
        {/* Main Content often has its own containers, remove global container to allow full hero sections */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gigs" element={<Gigs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gigs/:id" element={<GigDetails />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-gig" 
              element={
                <ProtectedRoute>
                  <CreateGig />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <footer className="border-t border-white/10 bg-dark-card pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                   {/* Brand */}
                   <div className="col-span-1 md:col-span-1">
                      <h3 className="text-2xl font-bold text-white mb-4">Gig<span className="text-primary-light">Flow</span></h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        The world's most premium marketplace for freelance talent. Connect, collaborate, and create with confidence.
                      </p>
                   </div>
                   
                   {/* Links Columns */}
                   <div>
                      <h4 className="font-bold text-white mb-6">Platform</h4>
                      <ul className="space-y-4 text-sm text-gray-400">
                         <li><span className="hover:text-primary transition-colors cursor-default">Browse Gigs</span></li>
                         <li><span className="hover:text-primary transition-colors cursor-default">How it Works</span></li>
                         <li><span className="hover:text-primary transition-colors cursor-default">Pricing</span></li>
                      </ul>
                   </div>
                   <div>
                      <h4 className="font-bold text-white mb-6">Company</h4>
                      <ul className="space-y-4 text-sm text-gray-400">
                         <li><span className="hover:text-primary transition-colors cursor-default">About Us</span></li>
                         <li><span className="hover:text-primary transition-colors cursor-default">Careers</span></li>
                         <li><span className="hover:text-primary transition-colors cursor-default">Press</span></li>
                      </ul>
                   </div>
                   <div>
                      <h4 className="font-bold text-white mb-6">Support</h4>
                      <ul className="space-y-4 text-sm text-gray-400">
                         <li><span className="hover:text-primary transition-colors cursor-default">Help Center</span></li>
                         <li><span className="hover:text-primary transition-colors cursor-default">Terms of Service</span></li>
                         <li><span className="hover:text-primary transition-colors cursor-default">Privacy Policy</span></li>
                      </ul>
                   </div>
                </div>
                
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                      &copy; {new Date().getFullYear()} GigFlow Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-gray-400">
                       <span className="hover:text-white cursor-default transition-colors">Twitter</span>
                       <span className="hover:text-white cursor-default transition-colors">LinkedIn</span>
                       <span className="hover:text-white cursor-default transition-colors">Instagram</span>
                    </div>
                </div>
            </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
