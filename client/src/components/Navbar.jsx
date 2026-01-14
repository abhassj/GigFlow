import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useSocket } from '../hooks/useSocket'; // Ensure socket is connected
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Initialize socket for notifications
  useSocket();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
           <img src={logo} alt="GigFlow" className="h-14 md:h-16 w-auto group-hover:scale-105 transition-transform duration-300" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/gigs" className="relative px-5 py-2 group overflow-hidden rounded-lg">
             <div className="absolute inset-0 w-full h-full transition-all duration-300 rounded-lg group-hover:bg-white/10 opacity-0 group-hover:opacity-100"></div>
             <div className="absolute inset-0 w-full h-full rounded-lg border border-transparent bg-origin-border-box bg-clip-border group-hover:border-transparent mask-linear-gradient" style={{ backgroundImage: 'linear-gradient(45deg, #a855f7, #ec4899)' }}></div>
             <div className="absolute inset-[1px] rounded-[7px] bg-dark-bg/90 z-0"></div>
             <span className="relative z-10 font-medium bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent group-hover:text-white transition-all duration-300">
               Browse Gigs
             </span>
          </Link>
          
          {isAuthenticated ? (
            <>
               <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium transition-colors">Dashboard</Link>
               <Link to="/create-gig" className="text-gray-300 hover:text-white font-medium transition-colors">Post a Gig</Link>
               
               <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <span className="text-gray-300">Hi, <span className="font-semibold text-white">{user?.name}</span></span>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all"
                  >
                    Logout
                  </button>
               </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">Log In</Link>
              <Link to="/register" className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-card border-t border-white/10 p-6 flex flex-col gap-4 animate-fade-in-down">
          <Link to="/" className="text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Browse Gigs</Link>
          {isAuthenticated ? (
            <>
               <Link to="/dashboard" className="text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
               <Link to="/create-gig" className="text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Post a Gig</Link>
               <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300 py-2">Logout ({user?.name})</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <Link to="/register" className="text-center w-full py-3 rounded-xl bg-primary text-white font-bold" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
