import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currData: {

    }
}

export const locationsSlice = createSlice({
    name: "rLocations",
    initialState: initialState,
    reducers: {
        setrLocations: (state, {payload})=>{
            state.currData = payload
        }
    }
})

export const {setrLocations} = locationsSlice.actions

export default locationsSlice.reducer