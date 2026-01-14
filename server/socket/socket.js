import { Server } from 'socket.io';

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default port
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        // Client sends 'setup' event with userId to join their private room
        socket.on('setup', (userData) => {
            if (userData?._id) {
                socket.join(userData._id);
                console.log(`User ${userData._id} joined their private room.`);
                socket.emit('connected');
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

export { initSocket, getIO };
