import React from "react";
import moment from "moment";
import "./day.scss";
import {holidays} from "../utils/holidays"
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function Day(props) {
    let day = Intl.NumberFormat("de", { minimumIntegerDigits: 2 }).format(
        props.day
    );

    let month = Intl.NumberFormat("de", { minimumIntegerDigits: 2 }).format(
        props.month
    );

    return (
        holidays.find((holiday) => holiday.date === moment(`${props.year}-${month}-${day}`).format('YYYY-MM-DD'))?.holiday.length > 0 ?
            <OverlayTrigger overlay={
                <Tooltip id="tooltip-disabled">
                    {holidays.find((holiday) => holiday.date === moment(`${props.year}-${month}-${day}`).format('YYYY-MM-DD')).holiday}
                </Tooltip>}
            >
                <div className={"holiday"}>
                    {props.day}
                </div>
            </OverlayTrigger> :
            <div className={
                moment(`${props.year}-${month}-${day}`).format("dd") == "So" ||
                moment(`${props.year}-${month}-${day}`).format("dd") == "Sa"
                    ? "weekendDay"
                    : "day"
            }>
                {props.day}
            </div>
    )
}

export default Day;
