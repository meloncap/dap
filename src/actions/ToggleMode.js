import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDark: false,
  currentTitle: 'Home',
};


export const mode = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setDark:(state) => {
        state.isDark = !state.isDark;
    },
    setCurrentTitle: (state, action) => {
      state.currentTitle = action.payload;
    }
  },
  
});

export const { setDark, setCurrentTitle } = mode.actions;

export const getMode = (state) => state.mode.isDark;
export const getCurrentTitle = (state) => state.mode.currentTitle;


export default mode.reducer;
