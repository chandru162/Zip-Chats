// client/src/components/UserStatus.js
import { useEffect, useState } from 'react';
import { SocketContext } from '../Context/SoketContext';
import { useContext } from 'react';

const UserStatus = () => {
    const socket = useContext(SocketContext);
    const [statuses, setStatuses] = useState({});

    useEffect(() => {
        if (!socket) return;

        socket.on('updateUserStatus', ({ userId, isOnline }) => {
            setStatuses(prev => ({ ...prev, [userId]: isOnline }));
        });

        return () => {
            socket.off('updateUserStatus');
        };
    }, [socket]);

    // Render user statuses as needed
    return (
        <div>
            {/* Example rendering */}
            {Object.entries(statuses).map(([userId, isOnline]) => (
                <div key={userId}>
                    User {userId} is {isOnline ? 'Online' : 'Offline'}
                </div>
            ))}
        </div>
    );
};

export default UserStatus;