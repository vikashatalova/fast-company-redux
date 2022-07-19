import { createSlice, createAction } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";
import { generateauthError } from "../utils/generateAuthError";
import randomInt from "../utils/getRandomInt";
import history from "../utils/history";

const initialState = localStorageService.getAccessToken() ? {
    entities: null,
    isloading: true,
    error: null,
    auth: { userId: localStorageService.getUserId() },
    isLoggedIn: true,
    dataLoaded: false
} : {
    entities: null,
    isloading: false,
    error: null,
    auth: { userId: localStorageService.getUserId() },
    isLoggedIn: false,
    dataLoaded: false
};

const userSlice = createSlice({
    name: "users",
    initialState,
        reducers: {
            usersRequsted: (state) => {
                state.isloading = true;
            },
            usersRecived: (state, action) => {
                state.entities = action.payload;
                state.dataLoaded = true;
                state.isloading = false;
            },
            usersRequestFiled: (state, action) => {
                state.error = action.payload;
                state.isloading = false;
            },
            authRequestSuccess: (state, action) => {
                state.auth = action.payload;
                state.isLoggedIn = true;
            },
            authRequestFailed: (state, action) => {
                state.error = action.payload;
            },
            userCreated: (state, action) => {
                if (!Array.isArray(state.entities)) {
                    state.entities = [];
                }
                state.entities.push(action.payload);
            },
            userLoggedOut: (state) => {
                state.entities = null;
                state.isLoggedIn = false;
                state.auth = null;
                state.dataLoaded = false;
            },
            userUpdateSucessed: (state, action) => {
                state.entities[
                    state.entities.findIndex((u) => u._id === action.payload._id)
                ] = action.payload;
            },
            authRequested: (state) => {
                state.error = null;
            }
        }
});

const { reducer: usersReducer, actions } = userSlice;
const {
    usersRequsted,
    usersRecived,
    usersRequestFiled,
    authRequestSuccess,
    authRequestFailed,
    userCreated,
    userLoggedOut,
    userUpdateSucessed
} = actions;

const authRequested = createAction("users/authRequested");
const userCreateRequested = createAction("users/userCreateRequested");
const createUserFailed = createAction("users/createUserFailed");
const userUpdateRequested = createAction("users/userUpdateRequested");
const userUpdateFailed = createAction("users/userUpdateFailed");

export const logIn = ({ payload, redirect }) => async (dispatch) => {
    const { email, password } = payload;
    dispatch(authRequested());
    try {
        const data = await authService.login({ email, password });
        dispatch(authRequestSuccess({ userId: data.localId }));
        localStorageService.setTokens(data);
        history.push(redirect);
    } catch (error) {
        const { code, message } = error.response.data.error;
        if (code === 400) {
            const errorMessage = generateauthError(message);
            dispatch(authRequestFailed(errorMessage));
        } else {
            dispatch(authRequestFailed(error.message));
        }
    }
};

export const signUp = ({ email, password, ...rest }) => async (dispatch) => {
    dispatch(authRequested());
    try {
        const data = await authService.register({ email, password });
        localStorageService.setTokens(data);
        dispatch(authRequestSuccess({ userId: data.localId }));
        dispatch(createUser({
                _id: data.localId,
                email,
                rate: randomInt(1, 5),
                completedMeetings: randomInt(0, 200),
                image: `https://avatars.dicebear.com/api/avataaars/${(
                    Math.random() + 1
                )
                    .toString(36)
                    .substring(7)}.svg`,
                ...rest
        }));
    } catch (error) {
        dispatch(authRequestFailed(error.message));
    }
};

export const logOut = () => (dispatch) => {
    localStorageService.removeAuthData();
    dispatch(userLoggedOut());
    history.push("/");
};

function createUser(payload) {
    return async function (dispatch) {
        dispatch(userCreateRequested());
        try {
            const { content } = await userService.create(payload);
            dispatch(userCreated(content));
            history.push("/users");
        } catch (error) {
            dispatch(createUserFailed(error.message));
        }
    };
};

export const loadUsersList = () => async (dispatch) => {
    dispatch(usersRequsted());
    try {
        const { content } = await userService.get();
        dispatch(usersRecived(content));
    } catch (error) {
        dispatch(usersRequestFiled(error.message));
    }
};

export const updateUser = (payload) => async (dispatch) => {
    dispatch(userUpdateRequested());
    try {
        const { content } = await userService.update(payload);
        dispatch(userUpdateSucessed(content));
        history.push(`/users/${content._id}`);
    } catch (error) {
        dispatch(userUpdateFailed(error.message));
    }
};

export const getUsersList = () => (state) => state.users.entities;
export const getCurrentUserData = () => (state) => {
    return state.users.entities ? state.users.entities.find((u) => u._id === state.users.auth.userId) : null;
};

export const getUserById = (userId) => (state) => {
    if (state.users.entities) {
        return state.users.entities.find((u) => u._id === userId);
    }
};

export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;
export const getDataStatus = () => (state) => state.users.dataLoaded;
export const getCurrentUser = () => (state) => state.users.auth.userId;
export const getUsersLoadingStatus = () => (state) => state.users.isloading;
export const getAuthError = () => (state) => state.users.error;

export default usersReducer;
