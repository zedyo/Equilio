import React, {Fragment, useState, useEffect} from "react";
import {Col, Row, Form, FloatingLabel, Container, Card, Button} from "react-bootstrap";

function CreateEmployee(props) {

    const[qualificationData, setQualification] = useState([])

    useEffect(()=>{

        async function getQualificationData() {
            try {
                const {data} = await axios.get(`http://127.0.0.1:8000/api/qualifications`)
                setQualification(data.qualifications)
            } catch (error) {
                console.log(error)
            }
        }

        getQualificationData()
    }, [])

    return (
        <Fragment>
            <Container>
                <Card>
                    <Card.Header>
                        Anlegen von Mitarbeiterdaten
                    </Card.Header>
                    <Card.Body>
                        <Row className="g-2">
                            <Col md>
                                <FloatingLabel controlId="floatingInputGrid" label="Vorname">
                                    <Form.Control type="text" placeholder="Klara"/>
                                </FloatingLabel>
                            </Col>
                            <Col md>
                                <FloatingLabel controlId="floatingInputGrid" label="Nachname">
                                    <Form.Control type="text" placeholder="Musterstein"/>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className="g-2">
                            <Col md>
                                <FloatingLabel controlId="floatingInputGrid" label="Irgendwas">
                                    <Form.Control type="text" placeholder="Dings" />
                                </FloatingLabel>
                            </Col>
                            <Col md>
                                <FloatingLabel controlId="floatingSelectGrid" label="Qualifikation">
                                    <Form.Select aria-label="Floating label select example">
                                        <option isInvalid>Bitte auswählen</option>
                                        {qualificationData.map((qualificationObject) => <option value={qualificationObject.id}>{qualificationObject.description}</option>)}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Button href={`/employees`} variant="outline-success">Speichern</Button>{' '}
                    </Card.Body>
                </Card>
            </Container>
        </Fragment>
    )
}

export default CreateEmployee
