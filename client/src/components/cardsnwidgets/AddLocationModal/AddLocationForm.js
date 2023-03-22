import React from 'react'
//Forms
import {useForm} from 'react-hook-form'
//API
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
//Auth
import useAuth from '../../../hooks/useAuth';

export const AddLocationForm = (props) => {
    const axiosPrivate = useAxiosPrivate();
    const {auth} = useAuth();
    const addLocation = async (payload) => {
        payload["business_id"] = auth.business_id
        const response = await axiosPrivate.post(
            "/admin/addLocation", 
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

      const onSubmit = (data) => {
        //Add location request 
        //Trigger a fetchh for locations
        addLocation(data)
        props.toggleModal()
        console.log(data);
      }; // your form submit function which will invoke after successful validation
    
      console.log(watch("example")); // you can watch individual input by pass the name of the input
    
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
    
          {/* include validation with required or other standard HTML validation rules */}
          <label htmlFor="location_name">Location Name</label>
          <input id="location_name" {...register("location_name", { required: true })} />
          <label htmlFor="location_rc_number">RC Number</label>
          <input
            id="location_rc_number"
            {...register("location_rc_number", { required: true })}
          />
    
          <label htmlFor="address_line_1">Address Line 1</label>
          <input
            id="address_line_1"
            {...register("address_line_1", { required: true })}
          />
          <label htmlFor="address_line_2">Address Line 2</label>
          <input id="address_line_2" {...register("address_line_2")} />
          <label htmlFor="state">State</label>
          <input id="state" {...register("state", { required: true })} />
          <label htmlFor="city">City</label>
          <input id="city" {...register("city", { required: true })} />
          <label htmlFor="zipcode">Zip Code</label>
          <input id="zipcode" {...register("zipcode", { required: true })} />
          {/* errors will return when field validation fails  */}
          {errors.exampleRequired && <p>This field is required</p>}
    
          <input type="submit" />
        </form>
      );
}
