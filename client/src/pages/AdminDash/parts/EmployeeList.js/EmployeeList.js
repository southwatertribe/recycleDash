import React, { useEffect, useState } from 'react';
import LocationCard from '../LocationCard/LocationCard';
//Style

//State/Reduxs
import { useDispatch, useSelector } from "react-redux";
import { setremployees } from '../../../../redux/employees';
//Requests
import {useQuery} from "react-query";
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import useAuth from '../../../../hooks/useAuth';
import EmpCard from '../EmployeeCard/EmpCard';




const EmployeeList = () => {
//Will use this in conjuction with redux
    
    const axiosPrivate = useAxiosPrivate();
    const {auth} = useAuth();
    //Redux
    const remployees = useSelector((state)=> state.remployees)
    const dispatch = useDispatch();
    
    //Request function
    //If state empty get locations <-> and if refresh trigger clocked call again
    const fetchEmployees = async () => { //Payload is business_id
        
        
          
            await axiosPrivate.get(
              `/admin/getEmployees`,          
              {
                headers: {'Content-Type': 'application/json'},
                params: {
                  business_id: auth.business_id
                }
              }
            ).then(response=>{
                console.log(response)
                dispatch(setremployees(response.data.employee_list))
            })
            // console.log(`Before get employees ${JSON.stringify(response.data)}`)
            
            
            // 
                       
    }
  
    
    //On render
    useEffect(()=> {
      
      fetchEmployees()
      
    }, [])
    
  return (
    <>
        {
            remployees.currData.length>0?
                 <div className='list-style'>
                   {remployees.currData.map((employee, i)=><EmpCard key={i} props={employee}/>)}
                 </div>                
                :<p>no locations</p>
        }
    </>
   
  )
}

export default EmployeeList