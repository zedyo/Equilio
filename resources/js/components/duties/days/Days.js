import React, { useState, Fragment } from "react";
import { daysToArray } from "../../../util/daysToArray";
import Day from "./day/Day";
import WeekDay from "./weeek_day/WeekDay";
import moment from "moment";

function Days(props) {
    const [checkerData, setChecker] = useState({
        month: `${moment().format("M")}`,
        year: `${moment().format("YYYY")}`,
    });

    const days = daysToArray(checkerData.year, checkerData.month);

    const daysRowStyle = {
        display: "grid",
        gridAutoFlow: "column",
        gridTemplateColumns: "150px",
    };

    return (
        <Fragment>
            <div style={daysRowStyle}>
                <div></div>
                {days.map((day) => {
                    return <Day key={day} day={day} />;
                })}
            </div>

            <div style={daysRowStyle}>
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
