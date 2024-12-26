// client/src/App.js

// import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SocketProvider from './Context/SoketContext';
import ChatPage from './Pages/ChatPage';
import Callspage from './Pages/Callspage';
import Nopage from './Pages/Nopage';
import Sidebar from './Components/Sidebar';
import Register from './Components/Register';
import Login from './Components/Login';

//css sections
import '../src/Css/Sidebar.css';
import '../src/App.css';
import AuthProvider from './Context/Auth';
import Profile from './Pages/Profile';
/////////////

// Assume you have user authentication in place
const userId = 'currentUserId';

function App() {
  return (
    <div className='app-div'>
      <AuthProvider>
      <SocketProvider userId={userId}>
        <Sidebar />
        <Routes>
          <Route path='/' element={<ChatPage/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/my-acount' element={<Profile/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/calls' element={<Callspage/>} />
          <Route path='*' element={<Nopage />} />
        </Routes>
      </SocketProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
