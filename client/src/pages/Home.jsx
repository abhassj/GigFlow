import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchGigs } from '../store/gigSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { items: gigs, loading } = useSelector((state) => state.gigs);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    dispatch(fetchGigs('')); 
  }, [dispatch]);

  // --- Slider Logic ---
  const latestGigs = gigs.slice(0, 6);
  const chunkedGigs = [];
  for (let i = 0; i < latestGigs.length; i += 3) {
      chunkedGigs.push(latestGigs.slice(i, i + 3));
  }

  useEffect(() => {
    if (!isPaused && chunkedGigs.length > 1 && !searchTerm) {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % chunkedGigs.length);
        }, 6000); // Slower, more deliberate rotation
        return () => clearInterval(interval);
    }
  }, [chunkedGigs.length, isPaused, searchTerm]);

  // --- Search Logic ---
  const isSearching = searchTerm.trim().length > 0;
  
  const filteredGigs = isSearching 
    ? gigs.filter(gig => 
        gig.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        gig.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-dark-bg selection:bg-primary/30 relative overflow-hidden">
      
      {/* Background - Subtle & Disciplined */}
      <div className="fixed inset-0 bg-dark-bg pointer-events-none -z-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-screen h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-white">
            Hire expert talent. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-primary to-accent-purple">Unstoppable work.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Access the top 1% of freelance talent on GigFlow. <br className="hidden md:block"/>
            Secure payments, verified experts, and zero friction.
          </p>
          
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent-purple/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative flex items-center bg-dark-card border border-white/10 rounded-2xl p-2 shadow-2xl transition-all border-opacity-50 focus-within:border-opacity-100 focus-within:border-primary/50">
              <div className="pl-4 pr-3 text-gray-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for development, design, marketing..."
                className="w-full bg-transparent px-2 py-4 text-lg text-white outline-none placeholder-gray-600 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {isSearching && (
                <button 
                    onClick={() => setSearchTerm('')}
                    className="mr-3 p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              )}
            </div>
            {/* Quick Tags */}
             {!isSearching && (
                <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500 font-medium opacity-60">
                    <span>Popular:</span>
                    <button onClick={() => setSearchTerm('React')} className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-white/50">React</button>
                    <button onClick={() => setSearchTerm('Design')} className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-white/50">Design</button>
                    <button onClick={() => setSearchTerm('SEO')} className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-white/50">SEO</button>
                </div>
             )}
          </div>
        </div>

        {/* Dynamic Content Section */}
        <div className="min-h-[500px]">
            {isSearching ? (
                // --- Search Results View ---
                <div className="animate-fade-in-up">
                    <div className="flex items-end justify-between mb-10 border-b border-white/5 pb-4">
                        <h2 className="text-3xl font-bold text-white">
                            Search Results
                        </h2>
                        <span className="text-gray-500 font-medium">{filteredGigs.length} projects found</span>
                    </div>

                    {filteredGigs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredGigs.map((gig) => (
                                <Link 
                                    key={gig._id} 
                                    to={`/gigs/${gig._id}`}
                                    className="group bg-dark-card border border-white/5 rounded-3xl p-1 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
                                >
                                    <div className="bg-dark-card rounded-[22px] p-7 h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                                gig.status === 'open' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-700/50 text-gray-400 border-gray-600'
                                            }`}>
                                                {gig.status}
                                            </span>
                                            <span className="text-xl font-bold text-white group-hover:text-primary transition-colors">${gig.budget}</span>
                                        </div>
                                        
                                        <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 leading-relaxed group-hover:text-primary-light transition-colors">{gig.title}</h3>
                                        
                                        <p className="text-gray-400 text-sm line-clamp-3 mb-8 leading-relaxed font-light">
                                            {gig.description}
                                        </p>
                                        
                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                 <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                                                    {gig.ownerId?.name?.[0]}
                                                 </div>
                                                 <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{gig.ownerId?.name}</span>
                                            </div>
                                            <span className="text-xs text-gray-600 font-medium">View Gig &rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 border border-white/5 border-dashed rounded-3xl">
                            <p className="text-xl text-gray-300 font-medium mb-2">No results found for "{searchTerm}"</p>
                            <p className="text-gray-500">Try adjusting your search terms.</p>
                        </div>
                    )}
                </div>
            ) : (
                // --- Default Slider View ---
                <div 
                    className="relative animate-fade-in"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Latest Opportunities</h2>
                            <p className="text-gray-400 font-light">Fresh projects posted by verified clients today.</p>
                        </div>
                        
                        {/* Elegant Dot Navigation */}
                        <div className="flex gap-3 mb-2">
                            {chunkedGigs.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        currentSlide === idx ? 'bg-white w-8' : 'bg-white/20 w-4 hover:bg-white/40'
                                    }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-80 rounded-3xl bg-white/5 animate-pulse"></div>
                            ))}
                        </div>
                    ) : chunkedGigs.length > 0 ? (
                        <div className="relative overflow-hidden">
                            <div 
                                className="flex transition-transform duration-700 ease-out h-full"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {chunkedGigs.map((chunk, slideIndex) => (
                                    <div key={slideIndex} className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-1">
                                        {chunk.map((gig) => (
                                            <Link 
                                                key={gig._id} 
                                                to={`/gigs/${gig._id}`}
                                                className="group bg-dark-card border border-white/5 rounded-3xl p-1 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 h-full"
                                            >
                                                <div className="bg-dark-card rounded-[22px] p-7 h-full flex flex-col">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                                            gig.status === 'open' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-700/50 text-gray-400 border-gray-600'
                                                        }`}>
                                                            {gig.status}
                                                        </span>
                                                        <span className="text-xl font-bold text-white group-hover:text-primary transition-colors">${gig.budget}</span>
                                                    </div>
                                                    
                                                    <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 leading-relaxed group-hover:text-primary-light transition-colors">{gig.title}</h3>
                                                    
                                                    <p className="text-gray-400 text-sm line-clamp-3 mb-8 leading-relaxed font-light">
                                                        {gig.description}
                                                    </p>
                                                    
                                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                                                {gig.ownerId?.name?.[0]}
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{gig.ownerId?.name}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-600 font-medium group-hover:text-primary transition-colors self-center">View Details</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                            <h3 className="text-xl font-bold text-white mb-2">No Gigs Available</h3>
                            <p className="text-gray-400">Be the first to post a project!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;
