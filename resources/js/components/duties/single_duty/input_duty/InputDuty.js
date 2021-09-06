import React, { useState } from "react";
import "../../../../../sass/duty.scss";

function InputDuty(props) {
    const allDuties = props.allDuties;
    if (allDuties) {
        const dutie = allDuties.find(
            (d) => d.day === props.day && d.employee_id === props.employee_id
        );
        let dutyVal = dutie ? dutie.shift.abrv : "";
        const [InputDuty, setInputDuty] = useState(dutyVal);
        const [DutyColor, setDutyColor] = useState("black");

        let color = dutie ? dutie.shift.color_hex : DutyColor;

        // TODO: Fehler wenn Duty nicht vorhanden ist.
        // TODO: Farbe verändert sich nicht wenn Überschrieben wird

        const inputColor = {
            color: color,
        };

        async function sendDuty(value, day, month, year, employee_id) {
            try {
                if (value !== "") {
                    const { data } = await axios.patch(
                        `http://127.0.0.1:8000/api/duty/`,
                        {
                            value,
                            day,
                            month,
                            year,
                            employee_id,
                        }
                    );
                    setDutyColor(data.new_duty.shift.color_hex);
                    console.log(DutyColor);
                }
            } catch (error) {
                //TODO: Nur bei richtigem Statuscode 404 ausführen
                console.log(error);
                // setInputDuty("");
            }
        }

        return (
            <input
                style={inputColor}
                className="inputDutyForm"
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
