import React, {useEffect} from "react";
import {Fragment} from "react";
import {Card, Col, Button} from "react-bootstrap";
import axios from "axios";
import {useHistory} from "react-router-dom";

function Qualification(props) {

    const history = useHistory()

    async function destroyData(deletedQualificationId) {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/qualifications/${deletedQualificationId}/`)
            history.push("/qualifications")
        } catch (error) {
            console.log(error)
        }
    }

    //TODO: Delete soll die Seite automatisch neuladen.
    return (
        <Fragment>
            <Col md="auto">
                <Card style={{ width: '18rem', margin: '0.3rem' }}>
                    <Card.Body>
                        <Card.Title>{props.qualificationData.description}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">ID: {props.qualificationData.id}</Card.Subtitle>
                        <Button href={`/qualification/edit/${props.qualificationData.id}`} variant="outline-secondary" size="sm">Bearbeiten</Button>{' '}
                        <Button onClick={(e)=>destroyData(props.qualificationData.id)} variant="outline-danger" size="sm">Löschen</Button>{' '}
                    </Card.Body>
                </Card>
            </Col>
        </Fragment>
    )
}

export default Qualification;
