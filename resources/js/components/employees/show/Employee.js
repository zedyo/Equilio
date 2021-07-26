import React, {Fragment} from "react"
import {Button} from "react-bootstrap";

function Employee(props) {

    return (
        <Fragment>
            <tr>
                <td>{props.employeeData.id}</td>
                <td>{props.employeeData.first_name}</td>
                <td>{props.employeeData.last_name}</td>
                <td>{props.employeeData.qualification.description}</td>
                <td>
                    <Button href={`/employee/edit/${props.employeeData.id}`} variant="outline-secondary" size="sm">Bearbeiten</Button>{' '}
                    <Button onClick={()=>props.deleteHandler(props.employeeData.id)} variant="outline-danger" size="sm">Löschen</Button>{' '}
                </td>

            </tr>
        </Fragment>
    )
}

export default Employee
