import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../store/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, loading } = useSelector((state) => state.auth);

  const handleRegister = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px] animate-pulse animation-delay-1000" />
     
      <div className="w-full max-w-md glass-card p-10 rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 text-3xl font-bold tracking-tight">
            Gig<span className="text-primary-light">Flow</span>
          </Link>
          <h2 className="text-xl text-gray-300">Join the Community</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
            <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
            <input
              required
              type="text"
              className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <input
              required
              type="email"
              className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              required
              type="password"
              className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-primary-light hover:text-white font-medium transition-colors">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
