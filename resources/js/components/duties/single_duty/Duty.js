import React, { Fragment } from "react";
import InputDuty from "./input_duty/InputDuty";
import "../../../../sass/duty.scss";

function Duty(props) {
    return (
        <Fragment>
            <div className="employeeRow">
                <div>
                    <p className="employeeName">
                        {props.dutiesData.first_name}{" "}
                        {props.dutiesData.last_name}
                    </p>
                    <p className="employeeQualification">
                        {props.dutiesData.qualification.description}
                    </p>
                </div>
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
