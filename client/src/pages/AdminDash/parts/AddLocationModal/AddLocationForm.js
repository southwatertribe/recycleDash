import React from 'react'
//Forms
import {useForm} from 'react-hook-form'
import { GenericForm } from '../../../../utils/GenericForm';
//API
// import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
//Auth
import useAuth from '../../../../hooks/useAuth';

//State/Reduxs
import { useDispatch, useSelector } from 'react-redux';
import { setrLocations } from '../../../../redux/locations';


export const AddLocationForm = (props) => {
    // const axiosPrivate = useAxiosPrivate();
    const {auth} = useAuth();

    const stateOptions = [
  { value: 'Alabama', label: 'AL' },
  { value: 'Alaska', label: 'AK' },
  { value: 'Arizona', label: 'AZ' },
  { value: 'Arkansas', label: 'AR' },
  { value: 'California', label: 'CA' },
  { value: 'Colorado', label: 'CO' },
  { value: 'Connecticut', label: 'CT' },
  { value: 'Delaware', label: 'DE' },
  { value: 'District Of Columbia', label: 'DC' },
  { value: 'Florida', label: 'FL' },
  { value: 'Georgia', label: 'GA' },
  { value: 'Hawaii', label: 'HI' },
  { value: 'Idaho', label: 'ID' },
  { value: 'Illinois', label: 'IL' },
  { value: 'Indiana', label: 'IN' },
  { value: 'Iowa', label: 'IA' },
  { value: 'Kansas', label: 'KS' },
  { value: 'Kentucky', label: 'KY' },
  { value: 'Louisiana', label: 'LA' },
  { value: 'Maine', label: 'ME' },
  { value: 'Maryland', label: 'MD' },
  { value: 'Massachusetts', label: 'MA' },
  { value: 'Michigan', label: 'MI' },
  { value: 'Minnesota', label: 'MN' },
  { value: 'Mississippi', label: 'MS' },
  { value: 'Missouri', label: 'MO' },
  { value: 'Montana', label: 'MT' },
  { value: 'Nebraska', label: 'NE' },
  { value: 'Nevada', label: 'NV' },
  { value: 'New Hampshire', label: 'NH' },
  { value: 'New Jersey', label: 'NJ' },
  { value: 'New Mexico', label: 'NM' },
  { value: 'New York', label: 'NY' },
  { value: 'North Carolina', label: 'NC' },
  { value: 'North Dakota', label: 'ND' },
  { value: 'Ohio', label: 'OH' },
  { value: 'Oklahoma', label: 'OK' },
  { value: 'Oregon', label: 'OR' },
  { value: 'Pennsylvania', label: 'PA' },
  { value: 'Rhode Island', label: 'RI' },
  { value: 'South Carolina', label: 'SC' },
  { value: 'South Dakota', label: 'SD' },
  { value: 'Tennessee', label: 'TN' },
  { value: 'Texas', label: 'TX' },
  { value: 'Utah', label: 'UT' },
  { value: 'Vermont', label: 'VT' },
  { value: 'Virginia', label: 'VA' },
  { value: 'Washington', label: 'WA' },
  { value: 'West Virginia', label: 'WV' },
  { value: 'Wisconsin', label: 'WI' },
  { value: 'Wyoming', label: 'WY' },
];


    //Redux
    const rlocations = useSelector((state)=> state.rlocations)
    const dispatch = useDispatch();

    //Fields
    const fields = [
      {
        label: 'Company Name',
        name: 'company_name',
        component: 'input',
        type: 'text',
        validation: {required: true}
      },
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
        component: 'select',
        options: stateOptions,
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
      const response = await axios.get(
        `/location-service/${auth.business_id}/locations/`,          
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
        
        const response = await axios.put(
            `/location-service/${auth.business_id}/locations/${rc_number}`, 
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



