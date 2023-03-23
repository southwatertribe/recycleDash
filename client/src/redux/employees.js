import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currData: {

    }
}


export const employeesSlice = createSlice({
    name: "remployees",
    initialState: initialState,
    reducers: {
        setremployees: (state, {payload})=>{
            state.currData = payload
        }
    }
})

export const {setremployees} = employeesSlice.actions

export default employeesSlice.reducer