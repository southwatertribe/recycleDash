import React from 'react'
import useAuth from '../../hooks/useAuth'

export const AdminDash = () => {
  //need to get location info etc
  
  const {auth} = useAuth();
  return (
    <div>Welcome {auth.email}</div>
  )
}
