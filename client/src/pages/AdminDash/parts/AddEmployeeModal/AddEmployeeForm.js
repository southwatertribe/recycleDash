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
  const remployees = useSelector((state) => state.remployees)
  const rlocations = useSelector((state) => state.rlocations.currData)
  const dispatch = useDispatch();
  
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
      //options: employee_map,
      type: 'text',
      validation: { required: true },
    }
  ];

  const fetchEmployees = async () => {
    
      const response = await axiosPrivate.get(
        "/admin/getEmployees",
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
    const response = await axiosPrivate.post(
      "/admin/createEmployee",
      JSON.stringify(payload),
      {
        headers: {'Content-Type': 'application/json'},
        withCredentials: true,
      }
    )
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit =(data) => {
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
        />
  )
}

export default AddEmployeeForm