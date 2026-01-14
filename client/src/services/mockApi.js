import { v4 as uuidv4 } from 'uuid';

const getStorage = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Simulation of a "Transactional" Hire Operation
export const hireTransaction = async (bidId, gigId, ownerId) => {
  return new Promise((resolve, reject) => {
    // Artificial Delay
    setTimeout(() => {
      const gigs = getStorage('gigs');
      const bids = getStorage('bids');

      const gigIndex = gigs.findIndex(g => g.id === gigId);
      const gig = gigs[gigIndex];

      // 1. Authorization check
      if (!gig || gig.ownerId !== ownerId) {
        return reject(new Error('Unauthorized to hire for this gig'));
      }

      // 2. Race condition safety check (Atomic-like check)
      if (gig.status === 'assigned') {
        return reject(new Error('This gig has already been assigned'));
      }

      // 3. Perform atomic updates
      // Change Gig Status
      gigs[gigIndex].status = 'assigned';

      // Update Bids statuses
      const updatedBids = bids.map(b => {
        if (b.gigId === gigId) {
          if (b.id === bidId) return { ...b, status: 'hired' };
          if (b.status === 'pending') return { ...b, status: 'rejected' };
        }
        return b;
      });

      // Commit "Transaction" to Storage
      setStorage('gigs', gigs);
      setStorage('bids', updatedBids);

      // Simulation of Socket.io notification
      const hiredBid = updatedBids.find(b => b.id === bidId);
      if (hiredBid) {
        const notifications = getStorage('notifications');
        notifications.unshift({
          id: uuidv4(),
          userId: hiredBid.freelancerId,
          message: `Congratulations! You have been hired for "${gig.title}"`,
          type: 'success',
          createdAt: new Date().toISOString()
        });
        setStorage('notifications', notifications);
      }

      resolve(true);
    }, 800);
  });
};

export const createGig = async (data, userId, userName) => {
  const gig = {
    id: uuidv4(),
    title: data.title,
    description: data.description,
    budget: data.budget,
    ownerId: userId,
    ownerName: userName,
    status: 'open',
    createdAt: new Date().toISOString()
  };
  const gigs = getStorage('gigs');
  gigs.unshift(gig);
  setStorage('gigs', gigs);
  return gig;
};

export const postBid = async (data, userId, userName) => {
  const bids = getStorage('bids');

  // Check if already bid
  if (bids.some((b) => b.gigId === data.gigId && b.freelancerId === userId)) {
    throw new Error('You have already placed a bid on this gig');
  }

  const bid = {
    id: uuidv4(),
    gigId: data.gigId,
    freelancerId: userId,
    freelancerName: userName,
    message: data.message,
    price: data.price,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  bids.push(bid);
  setStorage('bids', bids);
  return bid;
};
