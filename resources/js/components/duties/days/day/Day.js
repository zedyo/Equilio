import React from "react";
import moment from "moment";
import "../../../../../sass/days.scss";

function Day(props) {
    let day = Intl.NumberFormat("de", { minimumIntegerDigits: 2 }).format(
        props.day
    );

    let month = Intl.NumberFormat("de", { minimumIntegerDigits: 2 }).format(
        props.month
    );

    return <div className={moment(`${props.year}-${month}-${day}`).format("dd") == "So" ? "weekendDayBig" : "day"}>{props.day}</div>;
}

export default Day;
