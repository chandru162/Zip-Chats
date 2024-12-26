import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';

export const SocketContext = createContext();

const SocketProvider = ({ children, userId }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = io("http://localhost:2500");
        setSocket(socket);
        // console.log(socket.id)

        // Emit `userOnline` only after the socket is connected
        socket.on('connection', () => {
            socket.emit('userOnline', userId);
            console.log(socket.userId)
        });

        // Cleanup on unmount
        return () => {
            socket.disconnect();
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
    userId: PropTypes.string.isRequired,
};

export default SocketProvider;
