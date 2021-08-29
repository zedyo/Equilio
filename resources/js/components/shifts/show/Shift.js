import React from "react";
import {Fragment} from "react";
import {Card, Col, Button} from "react-bootstrap";

function Shift(props)
{
    console.log(props.shiftsData.shift_type.name);
    return (
        <Fragment>
            <Col md="auto">
                <Card style={{ width: '18rem', margin: '0.3rem' }}>
                    <Card.Body>
                        <Card.Title style={{color: `${props.shiftsData.color_hex}`}}>{props.shiftsData.abrv}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">ID: {props.shiftsData.id}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">Tägliche Arbeitszeit: {props.shiftsData.h_duration}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">Schicht Typ: {props.shiftsData.shift_type.name}</Card.Subtitle>
                        <Button href={`/shift/edit/${props.shiftsData.id}`} variant="outline-secondary" size="sm">Bearbeiten</Button>{' '}
                        <Button onClick={()=>props.deleteHandler(props.shiftsData.id)} variant="outline-danger" size="sm">Löschen</Button>{' '}
                    </Card.Body>
                </Card>
            </Col>
        </Fragment>
    )
}

export default Shift;
