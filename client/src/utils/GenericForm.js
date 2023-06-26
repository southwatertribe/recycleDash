import React from 'react';
import { useForm } from 'react-hook-form';


//Style 
import '../styles/GenericForm.css';

export const GenericForm = ({
  fields,
  onSubmit,
  submitText,
  onLocationChange
}) => {
  const { register, handleSubmit, errors } = useForm();
  const renderInput = (field) => {
    if (field.component === 'input') {
      return (
        <input
            type={field.type}
            name={field.name}
            {...(register && field.validation && register(field.name, field.validation))}
            placeholder={field.placeholder}
          />
      );
    } else if (field.component === 'select') {
      return (
        <select 
          name={field.name} 
          {...(register && field.validation && register(field.name, field.validation))}
          onChange={field.name === 'curr_location' ? onLocationChange : null} 
        >
          
          {field.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>
      );
    } else {
      return null;
    }
  }
  return (
    <form className="generic-form" onSubmit={handleSubmit(onSubmit)}>
      <div className='form-container'>
      {fields.map((field, index) => (
        <div key={index}>
          <label htmlFor={field.name}>{field.label}</label>
          {/* <input
            type={field.type}
            name={field.name}
            {...(register && field.validation && register(field.name, field.validation))}
            placeholder={field.placeholder}
          /> */}
          {renderInput(field)}
          {errors && errors[field.name] && (
            <p>{errors[field.name].message}</p>
          )}
        </div>
      ))}
      {<button type="submit">{submitText || 'Submit'}</button>}
      </div>
    </form>
  );
};
