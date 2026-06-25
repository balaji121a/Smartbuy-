import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartState {
  total: number; // Subtotal/total price or item count depending on usage, usually total price of items.
  cartItems: { [productId: string]: number }; // Maps productId to quantity
}

const initialState: CartState = {
  total: 0,
  cartItems: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ productId: string }>) {
      const { productId } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId] += 1;
      } else {
        state.cartItems[productId] = 1;
      }
    },
    removeFromCart(state, action: PayloadAction<{ productId: string }>) {
      const { productId } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId] -= 1;
        if (state.cartItems[productId] <= 0) {
          delete state.cartItems[productId];
        }
      }
    },
    deleteItemFromCart(state, action: PayloadAction<{ productId: string }>) {
      const { productId } = action.payload;
      delete state.cartItems[productId];
    },
    clearCart(state) {
      state.cartItems = {};
      state.total = 0;
    },
    setCartState(state, action: PayloadAction<CartState>) {
      return action.payload;
    }
  },
});

export const { addToCart, removeFromCart, deleteItemFromCart, clearCart, setCartState } = cartSlice.actions;
export default cartSlice.reducer;
