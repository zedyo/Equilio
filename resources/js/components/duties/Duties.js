import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import Duty from "./single_duty/Duty";
import Days from "./days/Days";
import DateChecker from "./date_checker/DateChecker";
import ShiftTypesOverview from "./shift_type_statistics_overview/ShiftTypeOverview";
import moment from "moment";
import { Container } from "react-bootstrap";

import { daysToArray } from "../../util/daysToArray";
//import { createNoSubstitutionTemplateLiteral } from "typescript";

function Duties() {
    moment.locale("de");

    const [dutiesData, setDuty] = useState(null);
    const [allDuties, setAllDuties] = useState([]);

    const [checkerData, setChecker] = useState({
        month: `${moment().format("M")}`,
        year: `${moment().format("YYYY")}`,
    });

    const days = daysToArray(checkerData.year, checkerData.month);

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

    return (
        <Fragment>
            <Container key="container">
                <DateChecker
                    key="datechecker-render"
                    checkerData={checkerData}
                    setChecker={setChecker}
                />

                <Days />

                <div>
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
                <ShiftTypesOverview
                    days={days}
                    checkerData={checkerData}
                    allDuties={allDuties}
                />
            </Container>
        </Fragment>
    );
}

export default Duties;
