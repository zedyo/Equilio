import React from "react";
import moment from "moment";
import "../../../../../sass/days.scss";

function WeekDay(props) {
    let day = Intl.NumberFormat("de", { minimumIntegerDigits: 2 }).format(
        props.day
    );

    let month = Intl.NumberFormat("de", { minimumIntegerDigits: 2 }).format(
        props.month
    );

    return (
        <div className="weekDay">
            {moment(`${props.year}-${month}-${day}`).format("dd")}
        </div>
    );
}

export default WeekDay;
