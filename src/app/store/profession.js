import { createSlice } from "@reduxjs/toolkit";
import professionService from "../services/profession.service";

const professionsSlice = createSlice({
    name: "professions",
    initialState: {
        entities: null,
        isloading: true,
        error: null
    },
    reducers: {
        professionsRequsted: (state) => {
            state.isloading = true;
        },
        professionsRecived: (state, action) => {
            state.entities = action.payload;
            state.isloading = false;
        },
        professionsRequestFiled: (state, action) => {
            state.error = action.payload;
            state.isloading = false;
        }
    }
});

const { reducer: professionsReducer, actions } = professionsSlice;
const { professionsRequsted, professionsRecived, professionsRequestFiled } = actions;

export const loadProfessionsList = () => async (dispatch) => {
    dispatch(professionsRequsted());
    try {
        const { content } = await professionService.get();
        dispatch(professionsRecived(content));
    } catch (error) {
        dispatch(professionsRequestFiled(error.message));
    }
};

export const getProfessions = () => (state) => state.professions.entities;
export const getProfessionsLoadingStatus = () => (state) => state.professions.isloading;
export const getProfessionsById = (id) => (state) => {
    if (state.professions.entities) {
        return state.professions.entities.find((p) => p._id === id);
    }
};

export default professionsReducer;
