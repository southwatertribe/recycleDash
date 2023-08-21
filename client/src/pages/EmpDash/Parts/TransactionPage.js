import {React, useState, useEffect} from 'react'
import useAuth from '../../../hooks/useAuth';

//Parts
import TransactionForm from '../../../utils/TransactionForm';

import axios from '../../../utils/axios';


const TransactionPage = () => {

  const {auth} = useAuth()
  const [cashDrawerID, setCashDrawerID] = useState('');
 

  // //Get cashdrawer
  const fetchCashDrawer = async() => {

    //TODO: Optimize to not constantly pull this data in a better way
      try {
        const response = await axios.get(
          `/location-service/${auth.curr_location}/cash-drawer`,
          {
            headers: {'Content-Type': 'application/json'},
          }
        )
        console.log("GOT ID")
        console.log(response.data.cash_drawer_id)
        setCashDrawerID(response.data.cash_drawer_id)
  
      } catch (error) {
        console.log(error)      
      }      
    
  } 



  useEffect(()=>{
    
    if (cashDrawerID === '') {
       fetchCashDrawer()      
    }
   
    
  }, [])

  return (
    
    <div>
      <TransactionForm cash_drawer_id={cashDrawerID} location={auth.curr_location}/>
    </div>
    
  )
}

export default TransactionPage