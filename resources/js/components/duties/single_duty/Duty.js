import React, { Fragment } from "react";
import InputDuty from "./input_duty/InputDuty";

function Duty(props) {
    const employeeRowStyle = {
        display: "grid",
        gridAutoFlow: "column",
        gridTemplateColumns: "150px",
    };

    return (
        <Fragment>
            <div style={employeeRowStyle}>
                <p>
                    {props.dutiesData.first_name} {props.dutiesData.last_name}
                </p>
                <Fragment>
                    {props.days.map((day) => (
                        <InputDuty
                            key={day}
                            day={day}
                            month={props.checkerData.month}
                            year={props.checkerData.year}
                            employee_id={props.dutiesData.id}
                            allDuties={props.allDuties}
                        />
                    ))}
                </Fragment>
            </div>
        </Fragment>
    );
}

export default Duty;
