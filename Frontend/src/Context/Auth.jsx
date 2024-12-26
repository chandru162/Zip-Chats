import React, { useContext, useState } from 'react'

const AuthContext =React.createContext()

export default function AuthProvider(props) {
    const[username,setusername]=useState('')
    const[objectId,setobjectId] = useState('')
    const[email,setEmail]=useState('')
    const[password,setpassword]=useState('')
    const[profilePicture, setprofilePicture] = useState('') 
    const[friends, setfriends] = useState([])
    const[isOnline, setisOnline] = useState()
    
    
    

    const login = (username, email, profilePicture, friends, isOnline)=>{
        setobjectId(objectId)
        setusername(username)
        setEmail(email)
        setprofilePicture(profilePicture)
        setfriends(friends)
        setisOnline(isOnline)
        setpassword(password)

        
    }

    const logout=()=>{
        setusername(null)
        setEmail('')
        setprofilePicture('')
        setfriends([null])
        setisOnline(false)
    }

  return (
    <AuthContext.Provider value={{objectId,username,email,profilePicture,friends,isOnline,login,logout}}>
        {props.children}
    </AuthContext.Provider>

  )
}

export const useAuth=()=>{
    return useContext(AuthContext)
}