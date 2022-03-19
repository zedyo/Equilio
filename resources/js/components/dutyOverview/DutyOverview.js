import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import DutyColumn from "./dutyColumn/DutyColumn";
import DaysColumn from "./daysColumn/DaysColumn";
import DateSelector from "./dateSelector/DateSelector";
import ShiftTypeStatisticsContainer from "./shiftTypeStatisticsContainer/ShiftTypeStatisticsContainer";
import moment from "moment";
import { Container } from "react-bootstrap";
import { daysToArray } from "../../util/daysToArray";

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
                <DateSelector
                    key="datechecker-render"
                    checkerData={checkerData}
                    setChecker={setChecker}
                />

                {/* <Days /> */}

                <DaysColumn days={days} checkerData={checkerData} />

                <div>
                    {dutiesData &&
                        dutiesData.map((dutyObject) => (
                            <DutyColumn
                                key={Math.random()}
                                dutiesData={dutyObject}
                                checkerData={checkerData}
                                days={days}
                                allDuties={allDuties}
                            />
                        ))}
                </div>
                <div className="separator" />
                <ShiftTypeStatisticsContainer
                    key={"d"}
                    days={days}
                    checkerData={checkerData}
                    allDuties={allDuties}
                />
            </Container>
        </Fragment>
    );
}

export default Duties;
