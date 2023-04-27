import React from 'react'
//Forms
import {useForm} from 'react-hook-form'
import { GenericForm } from '../../../../utils/GenericForm';
//API
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
//Auth
import useAuth from '../../../../hooks/useAuth';

//State/Reduxs
import { useDispatch, useSelector } from 'react-redux';
import { setrLocations } from '../../../../redux/locations';


export const AddLocationForm = (props) => {
    const axiosPrivate = useAxiosPrivate();
    const {auth} = useAuth();

    //Redux
    const rlocations = useSelector((state)=> state.rlocations)
    const dispatch = useDispatch();

    //Fields
    const fields = [
      {
        label: 'Location Name',
        name: 'location_name',
        component: 'input',
        type: 'text',
        validation: { required: true },
      },
      {
        label: 'RC Number',
        name: 'location_rc_number',
        component: 'input',
        type: 'text',
        validation: { required: true },
      },
      {
        label: 'Address Line 1',
        name: 'address_line_1',
        component: 'input',
        type: 'text',
        validation: { required: true },
      },
      {
        label: 'Address Line 2',
        name: 'address_line_2',
        component: 'input',
        type: 'text',
      },
      {
        label: 'State',
        name: 'state',
        component: 'input',
        type: 'text',
        validation: { required: true },
      },
      {
        label: 'City',
        name: 'city',
        component: 'input',
        type: 'text',
        validation: { required: true },
      },
      {
        label: 'Zip Code',
        name: 'zipcode',
        component: 'input',
        type: 'text',
        validation: { required: true },
      },
      
    ];
    
    //Request function
    //If state empty get locations <-> and if refresh trigger clocked call again
    const fetchLocations = async () => { //Payload is business_id        
          
            const response = await axiosPrivate.get(
              `/location-service/locations/${auth.business_id}`,          
              {
                headers: {'Content-Type': 'application/json'},
                params: {
                  business_id: auth.business_id
                }
              }
            ).then((response)=>{
              console.log(`Before get locations ${JSON.stringify(response.data)}`)
            
            
            dispatch(setrLocations(response.data))
            })    
    }

    const addLocation = async (payload) => {
        payload["business_id"] = auth.business_id
        let rc_number = payload["location_rc_number"]
        
        const response = await axiosPrivate.put(
            `/location-service/location/${rc_number}`, 
            JSON.stringify(payload),         
            {
              headers: {'Content-Type': 'application/json'},
              withCredentials: true,
              params: {
                "rc_number": rc_number
              }
            }
          )
    }

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
      } = useForm();

      const onSubmit = (data) => {
        //Add location request 
        //Trigger a fetchh for locations
        addLocation(data)
        fetchLocations()
        props.toggleModal()
        console.log(data);
      }; // your form submit function which will invoke after successful validation
    
    
      return (

        <GenericForm  
        fields={fields}
        onSubmit={onSubmit}
        submitText="Add"
        toggleModal={props.toggleModal}
        />
        
      );
}
