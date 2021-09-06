import React, { useState, Fragment } from "react";
import { daysToArray } from "../../../util/daysToArray";
import Day from "./day/Day";
import WeekDay from "./weeek_day/WeekDay";
import moment from "moment";
import "../../../../sass/days.scss";

function Days(props) {
    const [checkerData, setChecker] = useState({
        month: `${moment().format("MM")}`,
        year: `${moment().format("YYYY")}`,
    });

    const days = daysToArray(checkerData.year, checkerData.month);

    return (
        <Fragment>
            <div className="daysRow">
                <div></div>
                {days.map((day) => {
                    return <Day key={day} day={day} />;
                })}
            </div>

            <div className="daysRow">
                <div></div>
                {days.map((day) => {
                    return (
                        <WeekDay
                            key={"wd" + day}
                            day={day}
                            month={checkerData.month}
                            year={checkerData.year}
                        />
                    );
                })}
            </div>
        </Fragment>
    );
}

export default Days;
