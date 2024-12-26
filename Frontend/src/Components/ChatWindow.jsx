// client/src/components/ChatWindow.js
import { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../Context/SoketContext.jsx';
import { decryptMessage } from '../utils/Encription.jsx'; // Correct the case if necessary

const ChatWindow = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const socket = useContext(SocketContext);

    useEffect(() => {
        if (!socket) return;
        socket.on('receiveMessage', (message) => {
            const decrypted = decryptMessage(message.content);
            setMessages(prev => [...prev, { ...message, content: decrypted }]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [socket]);

    return (
        <div>
            <h2>Chat for User: {userId}</h2>
            {messages.map(msg => (
                <div key={msg._id}>
                    <strong>{msg.sender}</strong>:
                    <p>{msg.content}</p>
                </div>
            ))}
        </div>
    );
};

export default ChatWindow;