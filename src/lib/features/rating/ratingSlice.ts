import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Rating } from '../../../types';

export interface RatingState {
  list: Rating[];
}

const initialState: RatingState = {
  list: [],
};

const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    setRatings(state, action: PayloadAction<Rating[]>) {
      state.list = action.payload;
    },
  },
});

export const { setRatings } = ratingSlice.actions;
export default ratingSlice.reducer;
