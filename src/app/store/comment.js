import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";
import { nanoid } from "nanoid";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsRecived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequesFiled: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentsRemove: (state, action) => {
            state.entities = state.entities.filter((c) => c._id !== action.payload);
        },
        commentsCreate: (state, action) => {
            state.entities.push(action.payload);
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequested,
    commentsRecived,
    commentsRequesFiled,
    commentsRemove,
    commentsCreate
} = actions;

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsRecived(content));
    } catch (error) {
        dispatch(commentsRequesFiled(error.message));
    }
};

export const createComment = (payload, userId) => async (dispatch) => {
    const comment = {
        ...payload,
        _id: nanoid(),
        pageId: userId,
        created_at: Date.now(),
        userId: userId
    };
    try {
        const { content } = await commentService.createComment(comment);
        dispatch(commentsCreate(content));
    } catch (error) {
        dispatch(commentsRequesFiled(error.message));
    }
};

export const removeComment = (id) => async (dispatch) => {
    try {
        const { content } = await commentService.removeComment(id);
        if (content === null) {
            dispatch(commentsRemove(id));
        }
    } catch (error) {
        dispatch(commentsRequesFiled(error.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) => state.comments.isLoading;

export default commentsReducer;
