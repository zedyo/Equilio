import React from "react";
import {Fragment} from "react";
import {Link} from "react-router-dom";

function Qualification(props) {

    return (
    <Fragment>
            <h2>
                {props.qualificationData.id}
            </h2>
            <h1>
                {props.qualificationData.description}
            </h1>
            <Link to={`/qualification/edit/${props.qualificationData.id}`} >EDIT</Link>


            {/*{props.qualificationData.first_name}*/}
            {/*{props.qualificationData.last_name}*/}
        </Fragment>
    )
}

export default Qualification;