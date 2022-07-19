import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { useAuth } from "../hooks/useAuth";
import { logOut } from "../store/users";
const LogOut = () => {
    const dispatch = useDispatch();
    // const { logOut } = useAuth();
    useEffect(() => {
        dispatch(logOut());
    }, []);
    return <h1>Loading</h1>;
};

export default LogOut;
