import React, {Fragment, useState} from "react";
import axios from "axios";
import {Button, Card, Container, FormControl, InputGroup} from "react-bootstrap";
import {useHistory} from "react-router-dom";

function CreateShiftType()
{
    const history = useHistory()
    const [shiftTypeData, setShiftType] = useState({})

    async function submitFormHandler() {
        try {
            await axios.post(`http://127.0.0.1:8000/api/shift_types/`, {shiftTypeData})
            history.push("/shift_types")
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
                                Anlegen einer Schicht Art
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="shift_type_name">Bezeichnung</InputGroup.Text>
                                        <FormControl
                                            placeholder="Sonstige Schicht"
                                            aria-label="Bezeichnung"
                                            aria-describedby="shift_type_name"
                                            onChange={(event  )=>setShiftType({...shiftTypeData, name: event.target.value})}
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

export default CreateShiftType
