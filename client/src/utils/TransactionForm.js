import React, { useState, useEffect } from 'react'

import { useForm, useFormState } from 'react-hook-form';

//Auth
import useAuth from '../hooks/useAuth';


//axios
import axios from './axios';

///TODO Improve QOF of form

const TransactionForm = ({cash_drawer_id, location}) => {

    const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();   
  
    const [cashDrawerTotal, setCashDrawerTotal] = useState('');


    const CDTransaction = async (payload) => {

        console.log(payload)
        console.log(cash_drawer_id)
       
        try {
          const response = await axios.put(`/location-service/${location}/${cash_drawer_id}/cash_drawer_transactions`, payload);
          console.log(response)
        } catch (error) {
          console.log(error)      
        }
    }

      //Fetch Drawer Total
  const fetchCashDrawerTotal = async()=>{        
    try {
      const response = await axios.get(
        `/location-service/${location}/cash_drawer/total`
      )
      const newTotal = response.data.total
      console.log("Total fetched")
      setCashDrawerTotal(newTotal)
      console.log(cashDrawerTotal)
    } catch (error) {
      console.log(error)
    }
  }

  // const onSubmit = async (data) => {
  //       // Perform transaction logic here using data.expenseDeposit, data.amount, and data.description
  //       // Update totalAmount based on transaction type and amount
  //       // Reset the form fields
  //       await CDTransaction(data)
  //       setValue('transaction_type', 'expense');
  //       setValue('amount', '');
  //       setValue('description', '');
  //       await fetchCashDrawerTotal()
  //   };

    
  useEffect(()=>{
    
    fetchCashDrawerTotal()
   
    
  }, [])


  const onSubmit = async (data) => {
    await CDTransaction(data);
    setValue('amount', '');
    setValue('description', '');
    await fetchCashDrawerTotal();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ marginRight: '200px' }}>
        <h2>Cash</h2>
        {cashDrawerTotal < 0 ? (
          <div style={{ color: 'red', fontSize: 30 }}>
            -${Math.abs(cashDrawerTotal)}
          </div>
        ) : (
          <div style={{ color: 'green', fontSize: 30 }}>
            $ {cashDrawerTotal}
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <button
            type="button"
            onClick={() => setValue('transaction_type', 'expense')}
            style={{
              flex: 1,
              marginRight: '5px',
              backgroundColor:
                watch('transaction_type') === 'expense' ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setValue('transaction_type', 'deposit')}
            style={{
              flex: 1,
              marginLeft: '5px',
              backgroundColor:
                watch('transaction_type') === 'deposit' ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Deposit
          </button>
        </div>
        <label style={{ marginBottom: '10px' }}>
          Amount:
          <input
            type="number"
            {...register('amount', {
              required: true,
              pattern: {
                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                message:
                  'Please enter a valid amount with up to two decimal places',
              },
            })}
            style={{ marginLeft: '10px' }}
          />
        </label>
        <br />
        <label style={{ marginBottom: '10px' }}>
          Description:
          <input
            type="text"
            {...register('description')}
            style={{ marginLeft: '10px' }}
          />
        </label>
        <br />
        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Submit Transaction
        </button>
      </form>
    </div>
  );
}

export default TransactionForm