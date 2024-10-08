import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  mealsList: [],
  success_create: false,
  success_delete: false,
  success_update: false,
  flag_delete: false,
  meal_flagged: null,
  error: null,
};

export const mealsSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {
    createMealStart: (state) => {
      state.loading = true;
      state.error = false;
      state.success_create = false;
    },
    createMealSuccess: (state) => {
      state.loading = false;
      state.success_create = true;
    },
    createMealFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    listMealsStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    listMealsSuccess: (state, action) => {
      state.loading = false;
      state.mealsList = action.payload;
    },
    listMealsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteMealStart: (state) => {
      state.loading = true;
      state.error = false;
      state.success_delete = false;
    },
    deleteMealSuccess: (state) => {
      state.loading = false;
      state.success_delete = true;
    },
    deleteMealFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateMealStart: (state) => {
      state.loading = true;
      state.error = false;
      state.success_update = false;
    },
    updateMealSuccess: (state) => {
      state.loading = false;
      state.success_update = true;
    },
    updateMealFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    showMealDeleteAlert: (state, action) => {
      state.flag_delete = true;
      state.meal_flagged = action.payload;
    },
    hideMealDeleteAlert: (state) => {
      state.flag_delete = false;
      state.meal_flagged = null;
    },
  },
});

export const {
  createMealStart,
  createMealSuccess,
  createMealFail,
  listMealsStart,
  listMealsSuccess,
  listMealsFail,
  deleteMealStart,
  deleteMealSuccess,
  deleteMealFail,
  updateMealStart,
  updateMealSuccess,
  updateMealFail,
  showMealDeleteAlert,
  hideMealDeleteAlert,
} = mealsSlice.actions;

export default mealsSlice.reducer;
