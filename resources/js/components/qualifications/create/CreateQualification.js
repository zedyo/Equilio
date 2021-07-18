import React, {Fragment} from "react";
import {Button, Card, Container, FormControl, InputGroup} from "react-bootstrap";

function CreateQualification(props) {


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
                                        />
                                    </InputGroup>
                                </Card.Title>
                                <Button href={`/qualifications`} variant="outline-success">Speichern</Button>{' '}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        </Fragment>
    )
}

export default CreateQualification
