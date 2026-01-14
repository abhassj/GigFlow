import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyGigs, updateGigStatus } from '../store/gigSlice';
import { fetchMyBids, fetchBids, hireFreelancer } from '../store/bidSlice';
import ConfirmModal from '../components/ConfirmModal';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items: myGigs, loading: gigsLoading } = useSelector((state) => state.gigs);
    const { items: myBids, loading: bidsLoading } = useSelector((state) => state.bids);

    const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'applications'
    const [expandedGigId, setExpandedGigId] = useState(null);
    const [gigBids, setGigBids] = useState({});
    const [loadingBids, setLoadingBids] = useState({});
    const [hiringBidId, setHiringBidId] = useState(null);
    
    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        bid: null,
        gigId: null
    });

    useEffect(() => {
        dispatch(fetchMyGigs());
        dispatch(fetchMyBids());
    }, [dispatch]);

    const handleExpandGig = async (gigId) => {
        if (expandedGigId === gigId) {
            setExpandedGigId(null);
            return;
        }

        setExpandedGigId(gigId);
        
        // Fetch bids if not already loaded
        if (!gigBids[gigId]) {
            setLoadingBids(prev => ({ ...prev, [gigId]: true }));
            const result = await dispatch(fetchBids(gigId));
            if (fetchBids.fulfilled.match(result)) {
                setGigBids(prev => ({ ...prev, [gigId]: result.payload }));
            }
            setLoadingBids(prev => ({ ...prev, [gigId]: false }));
        }
    };

    const openHireConfirmation = (bid, gigId) => {
        setConfirmModal({
            isOpen: true,
            bid,
            gigId
        });
    };

    const closeHireConfirmation = () => {
        setConfirmModal({
            isOpen: false,
            bid: null,
            gigId: null
        });
    };

    const handleConfirmHire = async () => {
        const { bid, gigId } = confirmModal;
        
        if (!bid || !gigId) {
            console.error('Missing bid or gigId');
            alert('Error: Missing bid or gig information');
            return;
        }

        console.log('Full bid object:', bid);
        console.log('Bid ID:', bid._id);
        console.log('Gig ID:', gigId);
        console.log('Attempting to hire:', { bidId: bid._id, gigId, freelancer: bid.freelancerId?.name });
        setHiringBidId(bid._id);
        
        try {
            const result = await dispatch(hireFreelancer({ bidId: bid._id }));
            
            console.log('Hire result:', result);
            
            if (hireFreelancer.fulfilled.match(result)) {
                console.log('Hiring successful!');
                // Update local state
                dispatch(updateGigStatus({ id: gigId, status: 'assigned' }));
                
                // Update the bids for this gig
                const updatedBids = gigBids[gigId].map(b => {
                    if (b._id === bid._id) return { ...b, status: 'hired' };
                    return { ...b, status: 'rejected' };
                });
                setGigBids(prev => ({ ...prev, [gigId]: updatedBids }));
                
                // Close modal on success
                closeHireConfirmation();
            } else {
                // Handle error - show the actual error message from the API
                const errorMessage = result.payload || result.error?.message || 'Failed to hire freelancer';
                console.error('Hiring failed:', result);
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error during hiring:', error);
            alert('An unexpected error occurred: ' + (error.message || 'Unknown error'));
        } finally {
            setHiringBidId(null);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-dark-bg selection:bg-primary/30 relative">
            
            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeHireConfirmation}
                onConfirm={handleConfirmHire}
                isLoading={hiringBidId === confirmModal.bid?._id}
                title="Hire Freelancer"
                message={`Are you sure you want to hire ${confirmModal.bid?.freelancerId?.name} for $${confirmModal.bid?.price}? This action will close the project and reject all other proposals.`}
                confirmText="Hire Now"
                cancelText="Cancel"
            />

            {/* Background Atmosphere */}
            <div className="fixed top-0 left-0 w-full h-full bg-dark-bg -z-10" />
            <div className="fixed top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[128px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                        <p className="text-gray-400">Welcome back, <span className="text-white font-semibold">{user?.name}</span></p>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex bg-white/5 p-1 rounded-xl mt-6 md:mt-0">
                        <button 
                            onClick={() => setActiveTab('projects')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'projects' 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Posted Projects
                        </button>
                        <button 
                            onClick={() => setActiveTab('applications')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'applications' 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            My Applications
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="animate-fade-in-up">
                    
                    {/* --- PROJECTS TAB (CLIENT VIEW) --- */}
                    {activeTab === 'projects' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-white">Your Projects ({myGigs.length})</h2>
                                <Link to="/create-gig" className="flex items-center gap-2 text-primary hover:text-primary-light font-medium transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    Post New Project
                                </Link>
                            </div>

                            {gigsLoading ? (
                                <div className="space-y-4">
                                    {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />)}
                                </div>
                            ) : myGigs.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {myGigs.map(gig => {
                                        const isExpanded = expandedGigId === gig._id;
                                        const bids = gigBids[gig._id] || [];
                                        const bidsLoading = loadingBids[gig._id];

                                        return (
                                            <div key={gig._id} className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden transition-all">
                                                {/* Gig Header */}
                                                <div 
                                                    className="group p-6 hover:border-white/10 transition-all cursor-pointer"
                                                    onClick={() => handleExpandGig(gig._id)}
                                                >
                                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                                    gig.status === 'open' 
                                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                }`}>
                                                                    {gig.status}
                                                                </span>
                                                                <span className="text-xs text-gray-500">Posted {new Date(gig.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{gig.title}</h3>
                                                            <p className="text-sm text-gray-400 font-light line-clamp-1">{gig.description}</p>
                                                        </div>

                                                        <div className="flex items-center gap-8 w-full md:w-auto">
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-500 mb-1">Budget</div>
                                                                <div className="text-lg font-bold text-white">${gig.budget}</div>
                                                            </div>
                                                            
                                                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 hover:border-white/20 transition-all">
                                                                {isExpanded ? 'Hide' : 'View'} Proposals
                                                                <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Expanded Proposals Section */}
                                                {isExpanded && (
                                                    <div className="border-t border-white/5 p-6 bg-white/[0.02]">
                                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                                            Proposals ({bids.length})
                                                        </h4>

                                                        {bidsLoading ? (
                                                            <div className="space-y-3">
                                                                {[1,2].map(i => <div key={i} className="h-20 bg-white/5 animate-pulse rounded-xl" />)}
                                                            </div>
                                                        ) : bids.length > 0 ? (
                                                            <div className="space-y-3">
                                                                {bids.map(bid => (
                                                                    <div key={bid._id} className="bg-dark-bg/50 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all">
                                                                        <div className="flex justify-between items-start">
                                                                            <div className="flex gap-4 flex-1">
                                                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                                                                                    {bid.freelancerId?.name[0]}
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                        <h5 className="font-bold text-white">{bid.freelancerId?.name}</h5>
                                                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                                                            bid.status === 'hired' ? 'bg-green-500/10 text-green-400' :
                                                                                            bid.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                                                                                            'bg-yellow-500/10 text-yellow-400'
                                                                                        }`}>
                                                                                            {bid.status}
                                                                                        </span>
                                                                                    </div>
                                                                                    <p className="text-xs text-gray-500 mb-2">{bid.freelancerId?.email}</p>
                                                                                    <p className="text-sm text-gray-300 leading-relaxed">{bid.message}</p>
                                                                                </div>
                                                                            </div>

                                                                            <div className="text-right ml-4">
                                                                                <div className="text-xs text-gray-500 mb-1">Bid Amount</div>
                                                                                <div className="text-xl font-bold text-white mb-3">${bid.price}</div>
                                                                                
                                                                                {gig.status === 'open' && bid.status === 'pending' && (
                                                                                    <button 
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            openHireConfirmation(bid, gig._id);
                                                                                        }}
                                                                                        className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs font-bold border border-green-500/20 hover:border-green-500/30 transition-all"
                                                                                    >
                                                                                        Hire Now
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8 text-gray-500">
                                                                No proposals received yet.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                    <h3 className="text-lg font-bold text-white mb-2">No Projects Yet</h3>
                                    <p className="text-gray-400 mb-6">You haven't posted any gigs yet.</p>
                                    <Link to="/create-gig" className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-all">
                                        Post Your First Project
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- APPLICATIONS TAB (FREELANCER VIEW) --- */}
                    {activeTab === 'applications' && (
                        <div>
                             <h2 className="text-xl font-bold text-white mb-8">Your Proposals ({myBids.length})</h2>

                             {bidsLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white/5 animate-pulse rounded-2xl" />)}
                                </div>
                             ) : myBids.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {myBids.map(bid => (
                                        <div key={bid._id} className="relative bg-dark-card border border-white/5 rounded-[22px] p-6 hover:border-white/10 transition-all group">
                                            {/* Status Badge */}
                                            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                                bid.status === 'hired' ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-lg shadow-green-500/10' :
                                                bid.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                                {bid.status}
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-2">Applied to</h4>
                                                <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                                                    {bid.gigId?.title || 'Unknown Gig'}
                                                </h3>
                                            </div>
                                            
                                            <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                                <div>
                                                    <div className="text-gray-500 text-xs mb-1">Your Bid</div>
                                                    <div className="text-xl font-bold text-white">${bid.price}</div>
                                                </div>
                                                <Link to={`/gigs/${bid.gigId?._id}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                                                    View Project &rarr;
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             ) : (
                                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                    <h3 className="text-lg font-bold text-white mb-2">No Applications Yet</h3>
                                    <p className="text-gray-400 mb-6">Start browsing to find your next opportunity.</p>
                                    <Link to="/gigs" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all">
                                        Browse Listed Gigs
                                    </Link>
                                </div>
                             )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
