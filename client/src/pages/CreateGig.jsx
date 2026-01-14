import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../store/gigSlice';

const CreateGig = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.gigs);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(createGig({
        ...formData,
        budget: Number(formData.budget)
    }));
    
    if (createGig.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-dark-bg selection:bg-primary/30 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Post a New <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-purple">Project</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Connect with world-class freelancers. Describe your project clearly to attract the best talent on GigFlow.
            </p>
        </div>

        <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent-purple/30 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            
            <div className="relative glass-card p-1 rounded-3xl border border-white/10">
                <div className="bg-dark-card rounded-[22px] p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Title Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Project Title</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-dark-bg border border-white/10 rounded-xl px-5 py-4 text-white text-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600 font-medium"
                                placeholder="e.g. Build a Modern Landing Page for AI Startup"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        {/* Description Input */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Project Description</label>
                                <span className="text-xs text-gray-600">{formData.description.length} chars</span>
                            </div>
                            <textarea
                                required
                                rows={8}
                                className="w-full bg-dark-bg border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600 resize-none leading-relaxed"
                                placeholder="Describe the project requirements, necessary skills, timeline, and expected deliverables..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Be clear and specific to get better proposals.
                            </p>
                        </div>

                        {/* Budget Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Estimated Budget (USD)</label>
                            <div className="relative max-w-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-400 font-bold">$</span>
                                </div>
                                <input
                                    required
                                    type="number"
                                    className="w-full bg-dark-bg border border-white/10 rounded-xl pl-8 pr-4 py-4 text-white text-lg font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600"
                                    placeholder="0.00"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-accent-purple text-white font-bold py-5 rounded-xl text-lg hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                {loading ? 'Publishing Project...' : 'Publish Project Now'}
                            </button>
                            <p className="text-center mt-6 text-sm text-gray-500">
                                This project will be publicly visible to our freelancer community.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;
