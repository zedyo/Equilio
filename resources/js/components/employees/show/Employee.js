import React, {Fragment} from "react"

function Employee(props) {
    return (
        <Fragment>
            <h1>{props.employeeData.first_name} {props.employeeData.last_name} </h1>
            <h2>{props.employeeData.qualification_id}</h2>
            <button>Info</button>
        </Fragment>

        // props.employeeData entspricht dem <Qualification employeeData={}/>
        // hier ist das Objekt das man auslesen kann
    )

}

export default Employee