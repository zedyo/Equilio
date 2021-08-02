import React, {Fragment, useState, useEffect} from "react";
import {Col, Row, Form, FloatingLabel, Container, Card, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import axios from "axios";

function CreateEmployee()
{
    const history = useHistory()
    const[qualificationData, setQualification] = useState([])
    const[employeeData, setEmployee] = useState({})


    useEffect(()=>{
        async function getQualificationData() {
            try {
                const {data} = await axios.get(`http://127.0.0.1:8000/api/qualifications`)
                setQualification(data.qualifications)
            } catch (error) {
                console.log(error.message)
            }
        }
        getQualificationData()
    }, [])

    async function submitFormHandler() {
        try {
            await axios.post(`http://127.0.0.1:8000/api/employees/`, {employeeData})
            history.push("/employees")
        } catch (error) {
            console.log(error.message)
        }
    }

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
                                    <Form.Control type="text"
                                                  placeholder="Klara"
                                                  onChange={
                                                      (e)=>setEmployee(
                                                          {...employeeData, first_name: e.target.value}
                                                      )
                                                  }
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md>
                                <FloatingLabel controlId="floatingInputGrid" label="Nachname">
                                    <Form.Control type="text"
                                                  placeholder="Musterstein"
                                                  onChange={
                                                      (e)=>setEmployee(
                                                          {...employeeData, last_name: e.target.value}
                                                      )
                                                  }
                                    />
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
                                    <Form.Select aria-label="Floating label select example"
                                                 onChange={(e)=>setEmployee({...employeeData, qualification_id: parseInt(e.target.value)})}>
                                        <option key="0">Bitte auswählen</option>
                                        {qualificationData.map((qualificationObject) =>
                                            <option
                                                key={qualificationObject.id}
                                                value={qualificationObject.id}>
                                                {qualificationObject.description}
                                            </option>)}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Button onClick={submitFormHandler} variant="outline-success">Speichern</Button>{' '}
                    </Card.Body>
                </Card>
            </Container>
        </Fragment>
    )
}

export default CreateEmployee
