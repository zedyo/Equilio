import React, {Fragment} from "react"
import moment from "moment";
import {useState, useEffect} from "react";

function Duty(props)
{
    const[dutiesData, setDutiesData] = useState([])
    let daysInMonth = moment(
        `${props.checkerData.year}-${props.checkerData.month}`,
        "YYYY-MM"
    ).daysInMonth()

    const employeeRowStyle = {
        display: "grid",
        gridAutoFlow: "column",
        gridTemplateColumns: "150px"
    }

    async function sendDuty(value, day, month, year, employee_id) {
        if (value !== "") {
            await axios.patch(`http://127.0.0.1:8000/api/duty/`, {value, day, month, year, employee_id})
        }
        //TODO: An der Stelle evtl. ein else statement um den Eintrag aus der Datenbank zu löschen, wenn nichts mehr drin steht?
    }

    useEffect(()=>{
        (async ()=>{
        const duties = await axios.get(
            `http://127.0.0.1:8000/api/duties/${props.checkerData.year}/${props.checkerData.month}/${props.dutiesData.id}/`,
            {}
        )
            setDutiesData(duties.data.duties)
    }) ()
        }, [])

    const getDays = days => {
        let content = [];
        for (let i = 1; i <= days; i++) {
            let filter = dutiesData.filter(duty => duty.day === i)

            const inputStyle = {
                width: "30px",
                color: filter.length !== 0 ? filter[0].shift.color_hex : "black",
                textAlign: "center"
            }

            content.push(<div>
                <label>
                    <input style={inputStyle}
                           type="text"
                           // value={filter.length !== 0 ? filter[0].shift.abrv : ""}
                           value={filter.length !== 0 ? filter[0].shift.abrv : null}
                           onBlur={(e)=>{
                               sendDuty(e.target.value, i, props.checkerData.month, props.checkerData.year, props.dutiesData.id)
                           }}/>
                </label>
            </div>);
        }
        return content;
    };

    return (
        <Fragment>
            <div style={employeeRowStyle}>
                <hi>
                    {props.dutiesData.first_name} {props.dutiesData.last_name}
                </hi>
                <Fragment>
                    {/*{dutiesData.length !== 0 && getDays(daysInMonth)}*/}
                    {getDays(daysInMonth)}
                </Fragment>
            </div>
        </Fragment>
    )
}

export default Duty
