import React from 'react';
import { AdminDash } from '../AdminDash/AdminDash.js';
import LoginPage from '../LoginPage/LoginPage';
import useAuth from '../../hooks/useAuth';



export const Dash = () => {
    const {auth} = useAuth();
  return (
    auth?.role ? 
        auth.role === 1 ? <AdminDash/> : <div>Employee</div> :
        <LoginPage/>
  )
}
