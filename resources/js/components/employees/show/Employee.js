import React, {Fragment} from "react"
import {Button, Container} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import axios from "axios";

function Employee(props) {

    const history = useHistory()

    async function destroyData(deletedEmployeeId) {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/employees/${deletedEmployeeId}/`)
            history.push("/employees")
        } catch (error) {
            console.log(error)
        }
    }

    //TODO: Delete soll die Seite automatisch neuladen.
    return (
        <Fragment>
            <tr>
                <td>{props.employeeData.id}</td>
                <td>{props.employeeData.first_name}</td>
                <td>{props.employeeData.last_name}</td>
                <td>{props.employeeData.qualification.description}</td>
                <td>
                    <Button href={`/employee/edit/${props.employeeData.id}`} variant="outline-secondary" size="sm">Bearbeiten</Button>{' '}
                    <Button onClick={(e)=>destroyData(props.employeeData.id)} variant="outline-danger" size="sm">Löschen</Button>{' '}
                </td>

            </tr>
        </Fragment>
    )
}

export default Employee
