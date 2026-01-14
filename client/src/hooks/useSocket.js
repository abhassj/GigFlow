import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export const useSocket = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Connect to server
    const socket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      if (user && user._id) {
        socket.emit('join', user._id);
      }
    });

    socket.on('notification', (data) => {
      // Show browser notification or update UI
      if (window.Notification && Notification.permission === "granted") {
        new Notification("GigFlow", { body: data.message });
      } else {
        alert(`[NOTIFICATION]: ${data.message}`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);
};
