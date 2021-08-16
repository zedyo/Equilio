import React from "react";
import moment from "moment";

function WeekDay(props) {
    const daysStyle = {
        width: "28px",
    };

    return (
        <div style={daysStyle}>
            {moment(`${props.year}-${props.month}-${props.day}`).format("ddd")}
        </div>
    );
}

export default WeekDay;
