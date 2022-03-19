import React from "react";
import "./WorkingTimeCell.scss";

function WorkingTime(props) {
    let value = props.allDuties.map((dutyData) => {
        console.log(dutyData);
    });
    // console.log("Test: " + props.allDuties);
    return <input className="input" value="--.--" />;
}

export default WorkingTime;
