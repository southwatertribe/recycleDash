import React from 'react'

//style
import "./EmpDash.css"
//State/Redux
import useAuth from '../../hooks/useAuth'

export const EmpDash = () => {
  const {auth} = useAuth()
  return (
    <div className='wrapper'>
      <div className='welcome'>
        <div>{auth.f_name}</div>
      </div>
    </div>
  )
}
