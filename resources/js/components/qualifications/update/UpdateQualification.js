import React, {Fragment, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {Button, Card, Container, FormControl, InputGroup} from "react-bootstrap";


function UpdateQualification(props) {

    const params = useParams()
    const [qualificationsData, setQualification] = useState([])

    useEffect(()=>{
        async function getData() {
            try {
                const {data} = await axios.get(`http://127.0.0.1:8000/api/qualifications/${params.id}/`, {})
                setQualification(data.qualification)
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])

    return (
        <Fragment>
            <Container>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <Card>
                            <Card.Header>
                                Bearbeitung der Qualifikation
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    ID: {qualificationsData.id}
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="qualification_description">Bezeichnung</InputGroup.Text>
                                        <FormControl
                                            placeholder="Berufsbeziechnung"
                                            aria-label="Bezeichnung"
                                            aria-describedby="qualification_description"
                                            value={qualificationsData.description}
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

export default UpdateQualification
