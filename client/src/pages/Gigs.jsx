import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchGigs } from '../store/gigSlice';

const Gigs = () => {
  const dispatch = useDispatch();
  const { items: gigs, loading } = useSelector((state) => state.gigs);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBudget, setFilterBudget] = useState('all'); // all, low, mid, high

  useEffect(() => {
    // Basic debounce for search
    const timer = setTimeout(() => {
        dispatch(fetchGigs(searchTerm));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  const filteredGigs = gigs.filter(gig => {
      if (filterBudget === 'low') return gig.budget < 500;
      if (filterBudget === 'mid') return gig.budget >= 500 && gig.budget <= 2000;
      if (filterBudget === 'high') return gig.budget > 2000;
      return true;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 bg-dark-bg selection:bg-primary/30 relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[128px] pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-purple/5 rounded-full blur-[128px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div className="max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-purple">Opportunities</span>
                    </h1>
                    <p className="text-xl text-gray-400 font-light leading-relaxed">
                        Discover the best freelance gigs suited for your skills. Connect with top clients and start your next project today.
                    </p>
                </div>
                
                {/* Search & Filters */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent-purple/50 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative flex items-center bg-dark-card border border-white/10 rounded-xl p-1 shadow-xl">
                            <div className="pl-4 text-gray-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search services..." 
                                className="bg-transparent border-none rounded-lg pl-3 pr-4 py-3 text-white outline-none w-full md:w-64 placeholder-gray-500 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="relative group min-w-[180px]">
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <select 
                            className="w-full appearance-none bg-dark-card border border-white/10 hover:border-white/20 rounded-xl px-5 py-3.5 text-white outline-none cursor-pointer transition-all font-medium shadow-xl"
                            value={filterBudget}
                            onChange={(e) => setFilterBudget(e.target.value)}
                        >
                            <option value="all">Any Budget</option>
                            <option value="low">Under $500</option>
                            <option value="mid">$500 - $2,000</option>
                            <option value="high">Above $2,000</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="h-80 bg-white/5 rounded-3xl animate-pulse border border-white/5"></div>
                    ))}
                </div>
            ) : filteredGigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGigs.map(gig => (
                        <Link 
                            key={gig._id} 
                            to={`/gigs/${gig._id}`}
                            className="group relative bg-dark-card border border-white/5 rounded-3xl p-1 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
                        >
                             <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                             <div className="bg-dark-card rounded-[22px] p-7 h-full flex flex-col">
                                 <div className="flex justify-between items-start mb-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                        gig.status === 'open' ? 'bg-primary/10 text-primary-light border-primary/20' : 'bg-gray-700/50 text-gray-400 border-gray-600'
                                    }`}>
                                        {gig.status}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-400 text-xs uppercase font-bold tracking-wider mr-1">Budget</span>
                                        <span className="text-xl font-bold text-white group-hover:text-primary-light transition-colors">${gig.budget}</span>
                                    </div>
                                 </div>

                                 <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-primary-light transition-colors">{gig.title}</h3>
                                 
                                 <p className="text-gray-400 text-sm line-clamp-3 mb-8 leading-relaxed font-light">
                                    {gig.description}
                                 </p>

                                 <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-sm font-bold text-gray-300 border border-white/10 shadow-lg">
                                            {gig.ownerId?.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white leading-tight">{gig.ownerId?.name}</p>
                                            <p className="text-xs text-gray-500">Verified Client</p>
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-full bg-white/5 text-gray-400 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-45">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                 </div>
                             </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/5 border-dashed relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="relative z-10">
                        <svg className="w-16 h-16 mx-auto text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl font-bold text-white mb-2">No Gigs Found</h3>
                        <p className="text-gray-400 text-lg mb-8 max-w-sm mx-auto">We couldn't find any gigs matching your search criteria.</p>
                        <button onClick={() => { setSearchTerm(''); setFilterBudget('all'); }} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-bold">Clear Filters</button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default Gigs;
