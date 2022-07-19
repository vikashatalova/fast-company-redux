import React from "react";
// import { useProfessions } from "../../hooks/useProfession";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getProfessionsById, getProfessionsLoadingStatus } from "../../store/profession";

const Profession = ({ id }) => {
    // const { isLoading, getProfession } = useProfessions();
    const isLoading = useSelector(getProfessionsLoadingStatus());
    const profession = useSelector(getProfessionsById(id));
    // const prof = getProfession(id);
    if (!isLoading) {
        return <p>{profession.name}</p>;
    } else return "Loading...";
};
Profession.propTypes = {
    id: PropTypes.string
};
export default Profession;
