import { combineReducers, configureStore } from "@reduxjs/toolkit";
import commentsReducer from "./comment";
import professionsReducer from "./profession";
import qualitiesReducer from "./qualities";
import usersReducer from "./users";

const rootReducer = combineReducers({
    qualities: qualitiesReducer,
    professions: professionsReducer,
    users: usersReducer,
    comments: commentsReducer
});

export function createStore() {
    return configureStore({
        reducer: rootReducer
    });
};
