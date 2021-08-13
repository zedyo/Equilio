import React, { useState, Fragment } from "react";
import { Button, Form, Col, Row, InputGroup } from "react-bootstrap";
import moment from "moment";

function DateChecker(props) {
    const [checkerInput, setCheckerInput] = useState({
        month: `${moment().format("M")}`,
        year: `${moment().format("YYYY")}`,
    });

    return (
        <Fragment>
            <Form>
                <Row>
                    <Col xs={2}>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Monat</InputGroup.Text>
                            <Form.Control
                                id="inlineFormInputGroup"
                                type="text"
                                onChange={(e) =>
                                    setCheckerInput({ ...checkerInput, month: e.target.value })
                                }
                                value={checkerInput.month}
                                placeholder="Monat"
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={2}>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Jahr</InputGroup.Text>
                            <Form.Control
                                type="text"
                                onChange={(e) =>
                                    setCheckerInput({ ...checkerInput, year: e.target.value })
                                }
                                value={checkerInput.year}
                                placeholder="Jahr"
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <Button
                            onClick={(e) => props.setChecker({ ...checkerInput })}
                            variant="outline-success"
                        >
                            Suche
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    );
}

export default DateChecker;
