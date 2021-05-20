import { combineReducers } from "@reduxjs/toolkit";
import { reducer as socketReducer } from "app/socket/store";

const createReducer = (asyncReducers) =>
  combineReducers({
    data: socketReducer,
    ...asyncReducers,
  });

export default createReducer;
