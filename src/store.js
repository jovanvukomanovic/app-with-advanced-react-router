import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice";
import cartSlice from "./features/cart/cartSlice";

const store = configureStore({
  // if is reducer :userSlice (only one reducer) it must be like this in useSelecetor:  const username = useSelector((state) => state.username); instead of const username = useSelector((state) => state.user.username);
  reducer: {
    user: userSlice,
    cart: cartSlice,
  },
});

export default store;
