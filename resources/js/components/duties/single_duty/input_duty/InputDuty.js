import React, { useState } from "react";

function InputDuty(props) {
    const allDuties = props.allDuties;
    if (allDuties) {
        const dutie = allDuties.find(
            (d) => d.day === props.day && d.employee_id === props.employee_id
        );
        let dutyVal = dutie ? dutie.shift.abrv : "";
        const [InputDuty, setInputDuty] = useState(dutyVal);

        let color =
            InputDuty.length !== 0 && dutie ? dutie.shift.color_hex : "black";

        const inputStyle = {
            width: "30px",
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

        //TODO: State mit Color
        

        return (
            <input
                style={inputStyle}
                value={InputDuty}
                onChange={(e) => setInputDuty(e.target.value)}
                onBlur={(e) =>
                    sendDuty(
                        InputDuty,
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
}

export default InputDuty;
