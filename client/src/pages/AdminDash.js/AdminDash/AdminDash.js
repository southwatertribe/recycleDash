import React, { useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import axios from '../../../utils/axios';

//css
import "./AdminDash.css"

import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import Locations from '../../../components/Locations';
export const AdminDash = () => {
    
  const {auth} = useAuth();   
  return (
    <div className='wrapper'>
      <div className='welcome'>
        <h1>Welcome {auth.email}</h1>
      </div>
      <div className='locations'>
        <Locations/>
      </div>
    </div>
  )
}
