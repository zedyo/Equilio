import React, { useState, Fragment } from "react";
import { daysToArray } from "../../../util/daysToArray";
import Day from "./day/Day";
import WeekDay from "./weeek_day/WeekDay";
import moment from "moment";
import "../../../../sass/days.scss";

function Days(props) {
    const days = props.days;

    return (
        <Fragment>
            <div className="daysRow">
                <div></div>
                {days.map((day) => {
                    return <Day
                    key={"wd2"+day}
                    day={day}
                    month={props.checkerData.month}
                    year={props.checkerData.year}/>;
                })}
            </div>

            <div className="daysRow">
                <div></div>
                {days.map((day) => {
                    return (
                        <WeekDay
                            key={"wd" + day}
                            day={day}
                            month={props.checkerData.month}
                            year={props.checkerData.year}
                        />
                    );
                })}
            </div>
        </Fragment>
    );
}

export default Days;
