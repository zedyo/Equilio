import React, { useEffect, Fragment } from "react";
import axios from "axios";
import { Form, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "../../../../../../sass/shift_type.scss";

function ShiftTypeStatistic(props) {
    //TODO: Ankommende summe unter value aufzeigen

    return (
        <Fragment>
            <div>
                <input className="dayStatisticForm" disabled value="n" />
            </div>
        </Fragment>
    );
}

export default ShiftTypeStatistic;
