import React, { useState } from "react";

const BookMark = () => {
    const mark = <i className="bi bi-bookmark-heart"></i>;
    const clickMark = <i className="bi bi-bookmark-heart-fill"></i>;

    const [bookmark, setBookmark] = useState(false);

    const addToFavorites = () => {
    bookmark === false
      ? setBookmark((prev) => (prev = true))
      : setBookmark((prev) => (prev = false));
    };

    return (
        <div onClick={addToFavorites}>{bookmark === false ? mark : clickMark}</div>
    );
};

export default BookMark;
