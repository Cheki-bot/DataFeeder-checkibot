import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeTab: null,
}

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
});

export const { setActiveTab } = homeSlice.actions;

export default homeSlice.reducer;