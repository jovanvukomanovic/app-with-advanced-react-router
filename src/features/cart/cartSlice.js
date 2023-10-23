import { createSlice } from "@reduxjs/toolkit";

// it is good practice to derive state when ever is possible, so I dont want to place another state like: totalprice, numberOfItems.. because I can derive them from cart state
const initialState = {
  cart: [],

  //   cart: [
  //     {
  //       pizzaId: 12,
  //       name: "Mediterranenan",
  //       quantity: 2,
  //       unitPrice: 16,
  //       totalPrice: 32,
  //     },
  //   ],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      //payload= newItem
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      //payload = pizzaId
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      //payload = pizzaId
      //   with find method I have selected item from cart array, than I mutate it ++
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;

      //with this line of code I set cart to if it have 0 of some item (here pizzas) to delete item, I could write logic from deleteItem in here, but with cartSlice.caseReducers.deleteItem I can use this deleteItem action here in another action logic
      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
    clearCart(state, action) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// this is for useSelector hook, redux recomends to make calculations for derived state, directly when we take state with useSelector hook, but also recomends to set that calculations here in slice file ( before that was in CartOverview file like this:   const totalCartQuantity = useSelector((state) =>  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0),);), now it is:    const totalCartQuantity = useSelector(getTotalCartQuantity);
//also redux recomends to names of these functions starts with get , and to be placed in these slice files
//in bigger apllications these functions may cause performace isues,we can optimize these selectors with Reselect library
export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

// another advantage of writing functions for useSelector hook here in slice file is: if I in future change name of cart , to be for example shoppingCart, I need only change it here, not to search throught files and looking for useSelectors hooks to change name in them
export const getCart = (state) => state.cart.cart;

// it is passed parameter id from useSelector hook to getCurrentQuantityById, and with find method I calculated that specific cart item
export const getCurrentQuantityById = (id) => (state) =>
  //if item exist we take it quantity ( state.cart.cart.find((item) => item.pizzaId === id)?.quantity  optional chaning ? before word quantity), or if it dont exist ?? it is 0 (?? 0 second part)
  state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
