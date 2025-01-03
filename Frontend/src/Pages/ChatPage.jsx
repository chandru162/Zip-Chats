
import { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../Context/SoketContext';
import { useNavigate } from 'react-router-dom';
import { decryptMessage, encryptMessage } from '../utils/Encription.jsx';
import axios from 'axios';
// import { useLocation } from 'react-router-dom';
import '../Css/Chatpage.css'


const ChatPage = () => {
  const [senderId, setSenderId] = useState('');
  const [receiverId] = useState('');
  const [message, setMessage] = useState('');
  const [messagelist, setmessagelist] = useState([]);
  const Navigate = useNavigate();
  const socket = useContext(SocketContext);
  const userId = senderId; 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

                if (!token) {

                  alert("You are not logged in!");
                  // setLoading(false);
                  setTimeout(() => {
                    Navigate("/login");
                  },1000);
                  return;
                }

                const response = await axios.get("http://localhost:2500/auth/profile", {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                setSenderId(response.data.user.email);
      } catch (err) {
        console.error("Error fetching your Data:", err);
        // setTimeout(() => {
        //   Navigate("/login");
        // }, 5000);
      }
    };

    fetchProfile();
  }, [Navigate]);

  useEffect(() => {
    if (!socket) {
      console.error("Socket not connected");
      return;
    }

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('userOnline', userId);
      console.log("userOnline:",userId)
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('receiveMessage', (message) => {
      const decrypted = decryptMessage(message.content);
      setmessagelist(prev => [...prev, { ...message, content: decrypted }]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receiveMessage');
    };
  }, [socket, userId]);


    const sendMessage = () => {
      if (!socket) {
        console.error("Socket is not connected");
        return;
      }
      const encrypted = encryptMessage(message);
      socket.emit('sendMessage', { senderId, receiverId, content: encrypted, type: 'text' });
      setMessage("")
      console.log("message send successfully!", { senderId, receiverId, content: encrypted, type: 'text' });
      
    };

return(
  <div className="chat-container">
    <header className="chat-header">
      <div className="contact-info">
        <img
          src="https://via.placeholder.com/40"
          alt="Avatar"
          className="avatar"
        />
        <div className="contact-name">John Doe</div>
      </div>
    </header>
    <div className="chat-body">
      {messagelist.map((msg) => (
        <div
          key={msg._id}
          className={`message ${msg.senderId}`}
        >
          <p>{msg.content}</p>
          <span className="timestamp">{msg.time}</span>
        </div>
      ))}
    </div>
    <footer className="chat-footer">
      <input
        type="text"
        className="message-input"
        placeholder="Type a message"
        value={message}
        onChange={(e) => (setMessage(e.target.value))}
      />
      <button className="send-button" onClick={sendMessage}>
        &#9658;
      </button>
    </footer>
  </div>
)
};

export default ChatPage;

