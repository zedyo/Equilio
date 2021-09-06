import React, { Fragment } from "react";
import ShiftTypeStatistic from "./shift_type_statistic/ShiftTypeStatistic";
import "../../../../../sass/shift_type.scss";

function ShiftTypeStatistics(props) {
    // --- Abholen aus der Datenbank unnütz ---
    // async function loadData() {
    //     const data = await axios.get(
    //         `http://127.0.0.1:8000/api/shift_types/1/${props.day}/${props.month}/${props.year}/`,
    //         {}
    //     );
    //     console.log(data);
    // }
    // loadData();

    //TODO: Duties ab hier aussortieren Nach Tag und das übergabe der Anzahl der Duties nach diesem Tag.

    return (
        <Fragment>
            <div className="statisticRow">
                <div>
                    <p>Frühdienste</p>
                </div>
                {props.days.map((day) => (
                    <ShiftTypeStatistic
                        key={day}
                        day={day}
                        month={props.checkerData.month}
                        year={props.checkerData.year}
                    />
                ))}
            </div>
        </Fragment>
    );
}

export default ShiftTypeStatistics;
