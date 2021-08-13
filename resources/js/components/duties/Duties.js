import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import Duty from "./single_duty/Duty";
import DateChecker from "./date_checker/DateChecker";
import moment from "moment";
import { Container } from "react-bootstrap";
import { random } from "lodash";

import { daysToArray } from "../../util/daysToArray";

function Duties() {
    moment.locale("de");

    const [dutiesData, setDuty] = useState(null);
    const [allDuties, setAllDuties] = useState(null);

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

    const daysStyle = {
        width: "28px",
    };

    const Day = (props) => {
        return <div style={daysStyle}>{props.day}</div>;
    };

    const WeekDay = (props) => {
        return (
            <div style={daysStyle}>
                {moment(`${props.year}-${props.month}-${props.day}`).format(
                    "ddd"
                )}
            </div>
        );
    };

    const Days = () => {
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
    };

    useEffect(() => {
        async function getData() {
            const { data } = await axios.get(
                "http://127.0.0.1:8000/api/duties/"
            );
            setDuty(data.employees);
        }
        getData();
    }, []);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(
                `http://127.0.0.1:8000/api/duties/${checkerData.year}/${checkerData.month}`,
                {}
            );
            setAllDuties(data.duties);
        })();
    }, [checkerData]);

    function dateSubmitHandler() {
        console.log("NARF!!!!!");
    }

    return (
        <Fragment>
            <Container key="container">
                <DateChecker
                    key="datechecker-render"
                    //datePickerData={datePickerData}
                    checkerData={checkerData}
                    // setDatePickerData={setDatePickerData}
                    setChecker={setChecker}
                    dateSubmitHandler={dateSubmitHandler}
                />

                <Days />

                <div>
                    {console.log("NARF!!!!!!")}
                    {dutiesData &&
                        dutiesData.map((dutyObject) => (
                            <Duty
                                key={Math.random()}
                                dutiesData={dutyObject}
                                checkerData={checkerData}
                                days={days}
                                allDuties={allDuties}
                            />
                        ))}
                </div>
            </Container>
        </Fragment>
    );
}

export default Duties;
