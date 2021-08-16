import React from "react";

function Day(props) {
    const daysStyle = {
        width: "28px",
    };

    return <div style={daysStyle}>{props.day}</div>;
}

export default Day;
