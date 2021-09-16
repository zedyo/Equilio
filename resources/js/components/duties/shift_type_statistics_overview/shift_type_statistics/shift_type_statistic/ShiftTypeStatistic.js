import React, { useEffect, Fragment } from "react";
import axios from "axios";
import { Form, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "../../../../../../sass/shift_type.scss";

function ShiftTypeStatistic(props) {
    //TODO: Instant aktualisierung wenn eine Änderung stattfindet in der Duty Übersicht

    let shiftTypeDayData = props.shiftTypeDayData;

    return (
        <Fragment>
            <div>
                <input
                    className="dayStatisticForm"
                    disabled
                    value={shiftTypeDayData.length}
                />
            </div>
        </Fragment>
    );
}

export default ShiftTypeStatistic;
