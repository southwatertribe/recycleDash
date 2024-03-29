import React from 'react';
import { AdminDash } from '../AdminDash/AdminDash.js';
import { EmpDash } from '../EmpDash/EmpDash.js';
import LoginPage from '../LoginPage/LoginPage';
import useAuth from '../../hooks/useAuth';



export const Dash = () => {
    const {auth} = useAuth();
  return (
      auth?.role ? 
          auth.role === 'admin' ? <AdminDash/>
          :auth.role === 'emp' ? <EmpDash/>: <p>Something Shady</p>
          :<LoginPage/>
  )
}
