import { createSlice} from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        isLoading :true,
        data : [],
    },
    reducers: {
        addData: (state, actions) => {
            state.data = actions.payload;
        },
        setLoading : (state , actions) =>{
             state.isLoading = actions.payload
        }
    },
 
});

export const {addData  ,setLoading} = adminSlice.actions;
export default adminSlice.reducer;
