import React from "react";
import moment from "moment";
import "./day.scss";

function Day(props) {
    let day = Intl.NumberFormat("de", { minimumIntegerDigits: 2 }).format(
        props.day
    );

    let month = Intl.NumberFormat("de", { minimumIntegerDigits: 2 }).format(
        props.month
    );

    return (
        <div
            className={
                moment(`${props.year}-${month}-${day}`).format("dd") == "So" || moment(`${props.year}-${month}-${day}`).format("dd") == "Sa"
                    ? "weekendDayBig"
                    : "day"
            }
        >
            {props.day}
        </div>
    );
}

export default Day;
