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

    const getDays = days => {
        let content = [];
        for (let i = 1; i <= days; i++) {
            content.push(<div>
                <label>
                    <input style={inputStyle} type="text"/>
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
