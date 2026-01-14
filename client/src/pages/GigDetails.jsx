import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGigById, updateGigStatus } from '../store/gigSlice';
import { fetchBids, placeBid, hireFreelancer } from '../store/bidSlice';

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { currentGig: gig, loading: gigLoading, error: gigError } = useSelector((state) => state.gigs);
  const { items: bids, loading: bidsLoading } = useSelector((state) => state.bids);

  const [bidMessage, setBidMessage] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [isHiring, setIsHiring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchGigById(id));
  }, [dispatch, id]);

  useEffect(() => {
      if (gig && user && gig.ownerId?._id === user.id) {
          dispatch(fetchBids(id));
      }
  }, [dispatch, id, gig, user]);

  if (gigLoading) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!gig) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Gig Not Found</h2>
        <button onClick={() => navigate('/gigs')} className="text-primary hover:underline">Browse other gigs</button>
    </div>
  );

  const isOwner = user?.id === gig.ownerId?._id;

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    
    setIsBidding(true);
    const resultAction = await dispatch(placeBid({
        gigId: gig._id,
        message: bidMessage,
        price: Number(bidPrice)
    }));
    setIsBidding(false);

    if (placeBid.fulfilled.match(resultAction)) {
        setBidMessage('');
        setBidPrice('');
        setShowSuccess(true);
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
    } else {
        alert(resultAction.payload || 'Failed to place bid');
    }
  };

  const handleHire = async (bid) => {
    if (!isOwner || isHiring) return;
    if (!window.confirm(`Hire ${bid.freelancerId.name} for $${bid.price}?`)) return;

    setIsHiring(true);
    const resultAction = await dispatch(hireFreelancer({ bidId: bid._id }));
    setIsHiring(false);

    if (hireFreelancer.fulfilled.match(resultAction)) {
        dispatch(updateGigStatus({ id: gig._id, status: 'assigned' }));
    } else {
        alert(resultAction.payload || 'Hiring failed');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-dark-bg selection:bg-primary/30 relative">
        
        {/* Success Overlay Animation */}
        {showSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-dark-card border border-white/10 p-8 rounded-3xl shadow-2xl transform transition-all animate-bounce-in text-center max-w-sm mx-4">
                    <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                        <svg className="w-10 h-10 text-white animate-check" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Proposal Sent!</h3>
                    <p className="text-gray-400">Your proposal has been successfully submitted to the client.</p>
                </div>
            </div>
        )}

        {/* Background Gradients */}
        <div className="fixed top-20 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[128px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
            
            {/* Top Navigation / Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
                <span onClick={() => navigate('/gigs')} className="hover:text-white cursor-pointer transition-colors">Gigs</span>
                <span>/</span>
                <span className="text-gray-300 truncate max-w-md">{gig.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* LEFT CONTENT (8 COLUMNS) */}
                <div className="lg:col-span-8">
                    
                    {/* Hero Section */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md shadow-lg ${
                                gig.status === 'open' 
                                ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-green-900/20' 
                                : 'bg-gray-700/50 text-gray-400 border-gray-600'
                            }`}>
                                {gig.status === 'open' ? 'Actively Hiring' : gig.status}
                            </span>
                            <span className="text-gray-500 text-sm font-medium">Posted {new Date(gig.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">{gig.title}</h1>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-400">
                           <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5">
                                <span className="text-gray-500 uppercase text-xs tracking-wider">Budget</span>
                                <span className="text-white text-lg font-bold">${gig.budget}</span>
                           </div>
                           <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5">
                                <span className="text-gray-500 uppercase text-xs tracking-wider">Experience</span>
                                <span className="text-white">Expert Level</span>
                           </div>
                        </div>
                    </div>

                    {/* Gig Description */}
                    <div className="glass-card p-1 rounded-3xl mb-10 border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                        <div className="bg-dark-card/80 backdrop-blur-sm rounded-[22px] p-8 md:p-10">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                Project Description
                            </h3>
                            <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed font-light">
                                <p className="whitespace-pre-wrap">{gig.description}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Proposals Section (Only visible to owner) */}
                    {isOwner && (
                        <div className="animate-fade-in-up">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white">Proposals <span className="text-gray-500 text-lg font-normal">({bids.length})</span></h3>
                            </div>
                            
                            <div className="space-y-4">
                                {bidsLoading ? (
                                    <div className="h-20 bg-white/5 animate-pulse rounded-xl" />
                                ) : bids.length > 0 ? (
                                    bids.map((bid) => (
                                        <div key={bid._id} className="group relative bg-dark-card border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                                        {bid.freelancerId?.name[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{bid.freelancerId?.name}</h4>
                                                        <p className="text-gray-400 text-sm">{bid.freelancerId?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-2xl text-white">${bid.price}</div>
                                                    <div className={`text-xs uppercase font-bold tracking-wider mt-1 ${
                                                        bid.status === 'hired' ? 'text-green-400' : 'text-gray-500'
                                                    }`}>{bid.status}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-6 pl-16">
                                                <p className="text-gray-300 leading-relaxed border-l-2 border-white/10 pl-4">{bid.message}</p>
                                            </div>

                                            {gig.status === 'open' && bid.status === 'pending' && (
                                                <div className="mt-6 flex justify-end pt-4 border-t border-white/5">
                                                    <button 
                                                        onClick={() => handleHire(bid)}
                                                        className="px-6 py-2 bg-white/5 hover:bg-green-500/20 text-white hover:text-green-400 rounded-lg text-sm font-bold border border-white/10 hover:border-green-500/30 transition-all"
                                                    >
                                                        Hire Candidate
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                                        <p className="text-gray-500">No proposals received yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDEBAR (4 COLUMNS) */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Client Credibility Card */}
                    <div className="p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/5">
                        <div className="bg-dark-card rounded-[22px] p-6">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">About the Client</h4>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gray-700 to-gray-800 border border-white/10 p-1">
                                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-gray-400 font-bold text-xl">
                                        {gig.ownerId?.name[0]}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-white text-lg">{gig.ownerId?.name}</h3>
                                        {/* Verified Badge */}
                                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                    </div>
                                    <p className="text-sm text-gray-500">Member since 2024</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-white/5">
                                <div>
                                    <p className="text-2xl font-bold text-white">12</p>
                                    <p className="text-xs text-gray-500 uppercase mt-1">Jobs Posted</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white flex items-center gap-1">
                                        4.9 <span className="text-yellow-500 text-lg">★</span>
                                    </p>
                                    <p className="text-xs text-gray-500 uppercase mt-1">Rating</p>
                                </div>
                            </div>
                            
                            <div className="mt-4 flex items-center gap-2 text-sm text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="font-medium">Payment Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Proposal Card (For Freelancers) */}
                    {!isOwner && gig.status === 'open' ? (
                        <div className="sticky top-24 p-[1px] rounded-3xl bg-gradient-to-br from-primary via-accent-purple to-transparent shadow-2xl shadow-primary/20">
                            <div className="bg-dark-card rounded-[23px] p-6 relative overflow-hidden">
                                {/* Glow Effect */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                <h3 className="font-bold text-white text-xl mb-6 relative z-10">Submit Proposal</h3>
                                
                                <form onSubmit={handlePlaceBid} className="space-y-5 relative z-10">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Bid Price</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors">$</span>
                                            <input 
                                                type="number" 
                                                required
                                                className="w-full bg-dark-bg border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-white font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                placeholder="0.00"
                                                value={bidPrice}
                                                onChange={(e) => setBidPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cover Letter</label>
                                        <textarea 
                                            required
                                            className="w-full bg-dark-bg border border-white/10 rounded-xl p-4 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none h-40 resize-none transition-all placeholder:text-gray-600"
                                            placeholder="Introduce yourself and explain why you're perfect for this job..."
                                            value={bidMessage}
                                            onChange={(e) => setBidMessage(e.target.value)}
                                        ></textarea>
                                        <div className="text-right mt-2 text-xs text-gray-600 font-medium">
                                            {bidMessage.length} characters
                                        </div>
                                    </div>

                                    <button 
                                        disabled={isBidding}
                                        className="w-full bg-gradient-to-r from-primary to-accent-purple text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                        {isBidding ? 'Sending...' : 'Send Proposal'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : gig.status !== 'open' ? (
                        <div className="sticky top-24 border border-white/10 bg-white/5 p-8 rounded-3xl text-center backdrop-blur-md">
                            <div className="w-20 h-20 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-white/10">
                                <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Applications Closed</h3>
                            <p className="text-gray-400 text-sm">This gig is no longer accepting new proposals.</p>
                        </div>
                    ) : null}

                </div>
            </div>
        </div>
    </div>
  );
};

export default GigDetails;
