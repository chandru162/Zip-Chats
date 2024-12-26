// client/src/components/ChatInput.js
import { useState, useContext } from 'react';
import  {SocketContext}  from '../Context/SoketContext.jsx';
import '../Css/ChatInput.css'
import { encryptMessage } from '../utils/Encription.jsx'; // Correct the case if necessary
// import PropTypes from 'prop-types';
const ChatInput = ({ senderId, receiverId }) => {
    const [message, setMessage] = useState('');
    const socket = useContext(SocketContext);

    const sendMessage = () => {
        if (!socket) {
            console.error("Socket is not connected");
            return;
        }
        const encrypted = encryptMessage(message);
        socket.emit('sendMessage', { senderId, receiverId, content: encrypted, type: 'text' });
        console.log("message send sucessfully!", { senderId, receiverId, content: encrypted, type: 'text' });
        setMessage('');
    };

    return (
        <div>
            <input value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );

};

export default ChatInput;