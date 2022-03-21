import React, { Fragment } from "react";
import DutyCell from "./dutyCell/DutyCell";
import WorkingTimeCell from "./workingTimeCell/WorkingTimeCell";
import "./DutiesRow.scss";

function DutyRowContainer(props) {
    return (
        <Fragment>
            <div className="employeeRow">
                <div className="employeeContainer">
                    <div>
                        <p className="employeeName">
                            {props.dutiesData.first_name}{" "}
                            {props.dutiesData.last_name}
                        </p>
                        <p className="employeeQualification">
                            {props.dutiesData.qualification.description}
                        </p>
                    </div>
                </div>
                <Fragment>
                    {props.days.map((day) => (
                        <DutyCell
                            key={day}
                            day={day}
                            month={props.checkerData.month}
                            year={props.checkerData.year}
                            employee_id={props.dutiesData.id}
                            allDuties={props.allDuties}
                        />
                    ))}
                    <WorkingTimeCell
                        allDuties={props.allDuties}
                        employee_id={props.dutiesData.id}
                    />
                </Fragment>
            </div>
        </Fragment>
    );
}

export default DutyRowContainer;
