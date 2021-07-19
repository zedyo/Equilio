import React, {Fragment, useState, useEffect} from "react";
import {Col, Row, Form, FloatingLabel, Container, Card, Button} from "react-bootstrap";
import {useParams} from "react-router-dom";

function UpdateEmployee(props) {

    const params = useParams()
    const[employeeData, setEmployee] = useState([])
    const[qualificationData, setQualification] = useState([])

    useEffect(()=>{
        async function getEmployeeData() {
            try {
                const {data} = await axios.get(`http://127.0.0.1:8000/api/employees/${params.id}/`, {})
                setEmployee(data.employee)
            } catch (error) {
                console.log(error)
            }
        }

        async function getQualificationData() {
            try {
                const {data} = await axios.get(`http://127.0.0.1:8000/api/qualifications`)
                setQualification(data.qualifications)
            } catch (error) {
                console.log(error)
            }
        }

        getEmployeeData()
        getQualificationData()
    }, [])

    return (
        <Fragment>
            <Container>
                <Card>
                    <Card.Header>
                        Bearbeitung von Mitarbeiterdaten
                    </Card.Header>
                    <Card.Body>
                        <Col md>
                            <FloatingLabel controlId="floatingInputGrid" label="ID">
                                <Form.Control type="text" placeholder="Klara" value={employeeData.id} disabled/>
                            </FloatingLabel>
                        </Col>
                        <Row className="g-2">
                            <Col md>
                                <FloatingLabel controlId="floatingInputGrid" label="Vorname">
                                    <Form.Control type="text" placeholder="Klara" value={employeeData.first_name} />
                                </FloatingLabel>
                            </Col>
                            <Col md>
                                <FloatingLabel controlId="floatingInputGrid" label="Nachname">
                                    <Form.Control type="text" placeholder="Musterstein" value={employeeData.last_name}/>
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

export default UpdateEmployee
