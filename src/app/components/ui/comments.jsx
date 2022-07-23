import { orderBy } from "lodash";
import React, { useEffect } from "react";
import CommentsList, { AddCommentForm } from "../common/comments";
// import { useComments } from "../../hooks/useComments";
import { useDispatch, useSelector } from "react-redux";
import { createComment, getComments, getCommentsLoadingStatus, loadCommentsList, removeComment } from "../../store/comment";
// import { useParams } from "react-router-dom";
import { getCurrentUser } from "../../store/users";

const Comments = () => {
    // const { userId } = useParams();
    const userId = useSelector(getCurrentUser());
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadCommentsList(userId));
    }, [userId]);
    const isLoading = useSelector(getCommentsLoadingStatus());
    // const { createComment, removeComment } = useComments();
    const comments = useSelector(getComments());

    const handleSubmit = (data) => {
        // createComment(data);
        dispatch(createComment(data, userId));
        console.log(data);
        console.log(userId);
    };
    const handleRemoveComment = (id) => {
        dispatch(removeComment(id));
        removeComment(id);
    };
    const sortedComments = orderBy(comments, ["created_at"], ["desc"]);
    return (
        <>
            <div className="card mb-2">
                {" "}
                <div className="card-body ">
                    <AddCommentForm onSubmit={handleSubmit} />
                </div>
            </div>
            {sortedComments.length > 0 && (
                <div className="card mb-3">
                    <div className="card-body ">
                        <h2>Comments</h2>
                        <hr />
                        {!isLoading
                            ? <CommentsList
                                comments={sortedComments}
                                onRemove={handleRemoveComment}
                            /> : "loading.."
                        }
                    </div>
                </div>
            )}
        </>
    );
};

export default Comments;
