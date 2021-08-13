import React, { Fragment } from "react";
import moment from "moment";
import { useState, useEffect } from "react";

import { daysToArray } from "../../../util/daysToArray";

function Duty(props) {
    const checkerData = props.checkerData;
    const [dutiesData, setDutiesData] = useState([]);
    //console.log(props.dutiesData);
    // console.log('check')
    // console.log(dutiesData)

    /*
     let daysInMonth = moment(
        `${props.checkerData.year}-${props.checkerData.month}`,
        "YYYY-MM"
    ).daysInMonth();
    */

    const employeeRowStyle = {
        display: "grid",
        gridAutoFlow: "column",
        gridTemplateColumns: "150px",
    };

    const inputStyle = {
        width: "30px",
        //color: filter.length !== 0 ? filter[0].shift.color_hex : "black",
        color: "black",
        textAlign: "center",
    };

    //  useEffect(() => {
    //      (async () => {
    //          const { data } = await axios.get(
    //              `http://127.0.0.1:8000/api/duties/${props.checkerData.year}/${props.checkerData.month}/${props.dutiesData.id}/`,
    //              {}
    //          );
    //          setDutiesData(data.duties);
    //      })();
    //  }, []);

    /*
     async function sendDuty(value, day, month, year, employee_id) {
        if (value !== "") {
            await axios.patch(`http://127.0.0.1:8000/api/duty/`, {
                value,
                day,
                month,
                year,
                employee_id,
            });
        }
    }
     */
    //TODO: An der Stelle evtl. ein else statement um den Eintrag aus der Datenbank zu löschen, wenn nichts mehr drin steht?

    /* 
        useEffect(() => {
        (async () => {
            const duties = await axios.get(
                `http://127.0.0.1:8000/api/duties/${props.checkerData.year}/${props.checkerData.month}/${props.dutiesData.id}/`,
                {}
            );
            console.log(duties);
            setDutiesData(duties.data.duties);
        })();
    }, [checkerData]);
    */

    /*
    const getDays = (days) => {
        let content = [];
        for (let i = 1; i <= days; i++) {
            let filter = dutiesData.filter((duty) => duty.day === i);

            

            content.push(
                <div key={props.key}>
                    <label>
                        <input
                            style={inputStyle}
                            type="text"
                            // value={filter.length !== 0 ? filter[0].shift.abrv : ""}
                            value={
                                filter.length !== 0 ? filter[0].shift.abrv : ""
                            }
                            onBlur={(e) => {
                                sendDuty(
                                    e.target.value,
                                    i,
                                    props.checkerData.month,
                                    props.checkerData.year,
                                    props.dutiesData.id
                                );
                            }}
                        />
                    </label>
                </div>
            );
        }
        return content;
    };
    */

    function InputField(props) {
        const allDuties = props.allDuties;
        if (allDuties) {
            const dutie = allDuties.find(
                (d) =>
                    d.day === props.day && d.employee_id === props.employee_id
            );
            let dutyVal = dutie ? dutie.shift.abrv : "";
            const [inputField, setInputField] = useState(dutyVal);

            let color =
                inputField.length !== 0 && dutie
                    ? dutie.shift.color_hex
                    : "black";

            console.log(color);
            const inputStyle = {
                width: "30px",
                //color: inputField.length !== 0 ? dutie.shift.color_hex : "black",
                color: color,
                textAlign: "center",
            };
            async function sendDuty(value, day, month, year, employee_id) {
                if (value !== "") {
                    await axios.patch(`http://127.0.0.1:8000/api/duty/`, {
                        value,
                        day,
                        month,
                        year,
                        employee_id,
                    });
                }
            }

            return (
                <input
                    style={inputStyle}
                    value={inputField}
                    onChange={(e) => setInputField(e.target.value)}
                    onBlur={(e) =>
                        sendDuty(
                            inputField,
                            props.day,
                            props.month,
                            props.year,
                            props.employee_id
                        )
                    }
                />
            );
        }

        return <p>Loading...</p>;

        //console.log(inputField);

        //console.log(props.allDuties, props.dutiesData);
        // let dutyVal = dutie ? dutie.shift.abrv : "";
        // const [inputField, setInputField] = useState(dutyVal);
        // const inputStyle = {
        //     width: "30px",
        //     color: inputField.length !== 0 ? inputField.color_hex : "black",
        //     //color: "black",
        //     textAlign: "center",
        // };
        // async function sendDuty(value, day, month, year, employee_id) {
        //     if (value !== "") {
        //         await axios.patch(`http://127.0.0.1:8000/api/duty/`, {
        //             value,
        //             day,
        //             month,
        //             year,
        //             employee_id,
        //         });
        //     }
        // }
    }

    return (
        <Fragment>
            <div style={employeeRowStyle}>
                <p>
                    {props.dutiesData.first_name} {props.dutiesData.last_name}
                </p>
                <Fragment>
                    {/*{dutiesData.length !== 0 && getDays(daysInMonth)}*/}
                    {/*getDays(daysInMonth)*/}
                    {props.days.map((day) => (
                        <InputField
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
