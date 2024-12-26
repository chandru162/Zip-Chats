// import React from 'react'
import {NavLink} from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="side-bar">
        <nav className="nav-bar">
            <NavLink to={'/'} >Chats</NavLink>
            {/* <NavLink to={'/calls'} >Calls</NavLink> */}
            <NavLink to={'/statas'} >Statas</NavLink>
            <NavLink to={'/register'} >Singin</NavLink>
            <NavLink to={'/login'} >Login</NavLink>
            <NavLink to={'/my-acount'} >My Acount</NavLink>
        </nav>
        <p>Friends</p>
           
    </div>
  )
}
