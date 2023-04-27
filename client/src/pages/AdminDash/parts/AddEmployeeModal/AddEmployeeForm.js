import React from 'react'
//Forms
import {useForm} from 'react-hook-form'
import { GenericForm } from '../../../../utils/GenericForm'
//API
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
//Auth
import useAuth from '../../../../hooks/useAuth'
//State/Redux
import { useDispatch, useSelector } from 'react-redux'
import { setremployees } from '../../../../redux/employees'

const AddEmployeeForm = (props) => {
  const axiosPrivate = useAxiosPrivate();
  
  const {auth} = useAuth();
  //Redux
  const rlocations = useSelector((state) => state.rlocations.currData)
  const dispatch = useDispatch();
  
  //Handle rc change
  const handleLocationChange = (event) => {
    const selectedLocationName = event.target.value;
    
    const selectedLocation = rlocations.find(
      (location) => location.location_name === selectedLocationName
    );

    
    setValue("location", selectedLocation.location_rc_number);
  };

  //Fields
  const fields = [
    {
      label: 'First Name',
      name: 'f_name',
      component: 'input',
      type: 'text',
      validation: { required: true },
    },
    {
      label: 'Last Name',
      name: 'l_name',
      component: 'input',
      type: 'text',
      validation: { required: true },
    },
    {
      label: 'User Name',
      name: 'user_name',
      component: 'input',
      type: 'text',
      validation: { required: true },
    },
    {
      label: 'Password',
      name: 'password',
      component: 'input',
      type: 'text',
      validation: { required: true },
    },
    {
      label: 'Assign Location',
      name: 'curr_location',
      component: 'select',
      options: rlocations.map(obj => ({ value: obj.location_name })),
      type: 'text',
      validation: { required: true },
      onchange: handleLocationChange
    }
  ];

  const fetchEmployees = async () => {
    
      await axiosPrivate.get(
        `/admin/employees/${auth.business_id}`,
        {
          headers: {'Content-Type': 'application/json'},
                params: {
                  business_id: auth.business_id
                }
        }
      ).then(response=>{
        dispatch(setremployees(response.data.employee_list))
        
      }).catch(error=>{
        console.log(error)
      })
    }

  const addEmployee = async(payload) => {
    payload["business"] = auth.business_id
    await axiosPrivate.post(
      `/admin/employees/${auth.business_id}`,
      JSON.stringify(payload),
      {
        headers: {'Content-Type': 'application/json'},
        params: {
          business_id: auth.business_id
        },
        withCredentials: true,
      }
    )
  }

  const {
    setValue,
    // formState: { errors }
  } = useForm();

  const onSubmit =(data) => {
    //Logic to add location rc in database instead of name
    let newLocation = rlocations.find(
      (location) => location.location_name === data.curr_location
    );
    data.curr_location = newLocation.location_rc_number

    addEmployee(data)
    fetchEmployees()
    props.toggleModal()
    
  }

  

  return (
    <GenericForm  
        fields={fields}
        onSubmit={onSubmit}
        submitText="Add Employee"
        toggleModal={props.toggleModal}
        onLocationChange={handleLocationChange}
        />
  )
}

export default AddEmployeeForm