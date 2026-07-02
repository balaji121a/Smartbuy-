import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from '../../../types';

export interface AddressState {
  list: Address[];
}

const initialState: AddressState = {
  list: [],
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddresses(state, action: PayloadAction<Address[]>) {
      state.list = action.payload;
    },
    addAddress(state, action: PayloadAction<Address>) {
      state.list.push(action.payload);
    },
  },
});

export const { setAddresses, addAddress } = addressSlice.actions;
export default addressSlice.reducer;
