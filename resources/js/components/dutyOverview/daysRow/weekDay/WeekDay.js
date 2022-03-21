import React from "react";
import moment from "moment";
import "./weekDay.scss";

function WeekDay(props) {
    let day = Intl.NumberFormat("de", { minimumIntegerDigits: 2 }).format(
        props.day
    );

    let month = Intl.NumberFormat("de", { minimumIntegerDigits: 2 }).format(
        props.month
    );

    // let day = moment(`${props.year}-${month}-${day}`).format("dd");

    return (
        <div
            className={
                moment(`${props.year}-${month}-${day}`).format("dd") == "So"
                    ? "weekendDay"
                    : "weekDay"
            }
        >
            {moment(`${props.year}-${month}-${day}`).format("dd")}
        </div>
    );
}

export default WeekDay;
