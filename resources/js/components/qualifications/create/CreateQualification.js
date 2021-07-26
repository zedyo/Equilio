import React, {Fragment, useState} from "react";
import axios from "axios";
import {Button, Card, Container, FormControl, InputGroup} from "react-bootstrap";
import {useHistory} from "react-router-dom";

function CreateQualification(props) {

    const history = useHistory()
    const [qualificationsData, setQualification] = useState({})

    async function submitFormHandler() {
        try {
            await axios.post(`http://127.0.0.1:8000/api/qualifications/`, {qualificationsData})
            history.push("/qualifications")
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <Fragment>
            <Container>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <Card>
                            <Card.Header>
                                Anlegen einer Qualifikation
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="qualification_description">Bezeichnung</InputGroup.Text>
                                        <FormControl
                                            placeholder="Berufsbeziechnung"
                                            aria-label="Bezeichnung"
                                            aria-describedby="qualification_description"
                                            onChange={(event  )=>setQualification({...qualificationsData, description: event.target.value})}
                                        />
                                    </InputGroup>
                                </Card.Title>
                                <Button onClick={submitFormHandler} variant="outline-success">Speichern</Button>{' '}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        </Fragment>
    )
}

export default CreateQualification
