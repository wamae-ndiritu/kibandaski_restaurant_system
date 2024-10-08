import { configureStore } from "@reduxjs/toolkit";
import mealsReducer from "./slices/mealsSlices";
import orderReducers from "./slices/orderSlices";
import tablesReducers from "./slices/tableSlices";
import userReducers from "./slices/userSlices";
import staffReducer from "./slices/staffSlices";
import { cartReducer } from "./slices/cartReducers";
import paymentsReducer from "./slices/paymentSlice";
import navReducer from "./slices/navSlices";
import globalReducer from "./slices/globalSlices";

export const store = configureStore({
  reducer: {
    meals: mealsReducer,
    orders: orderReducers,
    tables: tablesReducers,
    user: userReducers,
    cart: cartReducer,
    staff: staffReducer,
    payments: paymentsReducer,
    nav: navReducer,
    global: globalReducer,
  }
});
