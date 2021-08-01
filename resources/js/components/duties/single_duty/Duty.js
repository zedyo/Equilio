import React, {Fragment} from "react"
import moment from "moment";

function Duty(props) {

    const inputStyle = {
        width: "30px"
    }

    const employeeRowStyle = {
        display: "grid",
        gridAutoFlow: "column",
        gridTemplateColumns: "150px"
    }

    async function sendDuty(value, day, month, year, employee_id) {
        if (value !== "") {
            const data = await axios.post(`http://127.0.0.1:8000/api/duty/`, {value, day, month, year, employee_id})
            console.log(data)
        }
    }

    const getDays = days => {
        let content = [];
        for (let i = 1; i <= days; i++) {
            content.push(<div>
                <label>
                    <input style={inputStyle}
                           type="text"
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
                    {getDays(moment(
                        `${props.checkerData.year}-${props.checkerData.month}`,
                        "YYYY-MM"
                    ).daysInMonth())}
                </Fragment>
            </div>
        </Fragment>
    )
}

export default Duty
