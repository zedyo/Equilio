import { result } from "lodash";
import React, { Fragment } from "react";
import ShiftTypeStatistics from "./shift_type_statistics/ShiftTypeStatistics";

function ShiftTypesOverview(props) {
    let allDuties = props.allDuties;

    console.log(allDuties);

    let shiftTypeData = props.allDuties.filter(
        (duty) => duty.shift.shift_type.id === 2
    );

    // TODO: Weiterleiten von Schichttypen

    console.log(shiftTypeData);

    return (
        <Fragment>
            <ShiftTypeStatistics
                days={props.days}
                checkerData={props.checkerData}
                shiftTypeData={shiftTypeData}
            />
        </Fragment>
    );
}

export default ShiftTypesOverview;
