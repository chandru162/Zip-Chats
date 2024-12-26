// import React from 'react'
import ChatInput from '../Components/ChatInput'
import ChatWindow from '../Components/ChatWindow'
import '../Css/ChatPage.css'
// import io from 'socket.io-client';
export default function ChatPage() {
  // const senderId = io.id;
  // const receiverId = io.id;
  // console.log(senderId, receiverId)
  return (
    <div className='chatpage-div'>
      <div className='chatpage-top-div'>
        <img src="" alt="profile" id='prof-img'/>
        <span>Adam</span>
        <span>online</span>
      </div>
      <ChatWindow/>
      <br/>
      <div className='chat-input-div'>
        <ChatInput/>
      </div>
    </div>
  )
}

// const mongoose = require('mongoose');
// const validReceiverId = mongoose.Types.ObjectId('60d5ec49f1b2c8b1f8e4e1a1'); // Example valid ObjectId
// message.receiver = validReceiverId; // Assign a valid ObjectId

