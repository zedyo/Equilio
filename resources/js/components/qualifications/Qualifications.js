import React, {Fragment, useEffect, useState} from "react";
import axios from "axios";
import Qualification from "./show/Qualification";
import {Button, Col, Row, Container} from "react-bootstrap";

function Qualifications() {
    const [qualificationsData, setQualification] = useState([])

    useEffect(()=>{
        async function getData() {
            try {
                const {data} = await axios.get('http://127.0.0.1:8000/api/qualifications', {})
                setQualification(data.qualifications)
            } catch (error) {
                console.log(error)
            }
        }
        getData()

    }, [])

    return (
        <Fragment>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">Qualifikationen</div>

                            <div className="card-body">
                                <Container fluid="sm">
                                    <Row>
                                            {qualificationsData.map((qualificationObject) => <Qualification key={qualificationObject.id}
                                                                                                            qualificationData={qualificationObject}/>)}
                                    </Row>
                                </Container>

                                <Container style={{ margin: '0.3rem' }} fluid="sm">
                                    <Button href={`/qualification/create`} variant="outline-success">Erstellen</Button>{' '}
                                </Container>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Qualifications;
