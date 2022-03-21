import React, { useState, Fragment } from "react";
import { Button, Form, Col, Row, InputGroup } from "react-bootstrap";
import moment from "moment";
import "./DateSelector.scss";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DateSelector(props) {
    const [dateSlectorInput, setDateSelectorInput] = useState({
        month: `${moment().format("M")}`,
        year: `${moment().format("YYYY")}`,
    });

    console.log(moment(`${props.dateSelectorData.month}`, "M").format("MMM"));
    return (
        <Fragment>
            <Form>
                <Row>
                    <Col xs="auto">
                        <InputGroup className="mb-3">
                            <Button
                                variant="outline-secondary"
                                size="text"
                                id="prev-month-button"
                                onClick={(e) => {
                                    props.dateSelectorData.month === "1"
                                        ? setDateSelectorInput({
                                              month: "12",
                                              year: (
                                                  Number(
                                                      props.dateSelectorData
                                                          .year
                                                  ) - 1
                                              ).toString(),
                                          })
                                        : setDateSelectorInput({
                                              ...dateSlectorInput,
                                              month: (
                                                  Number(
                                                      props.dateSelectorData
                                                          .month
                                                  ) - 1
                                              ).toString(),
                                          });

                                    props.setDateSelector({
                                        ...dateSlectorInput,
                                    });
                                }}
                            >
                                zurück
                            </Button>
                            <Form.Control
                                className="dateView"
                                placeholder={`${moment(
                                    `${props.dateSelectorData.month}`,
                                    "M"
                                ).format("MMMM")} ${
                                    props.dateSelectorData.year
                                }`}
                                disabled
                                size="text"
                            />
                            <Button
                                variant="outline-secondary"
                                size="text"
                                id="next-month-button"
                                onClick={(e) => {
                                    props.dateSelectorData.month === "12"
                                        ? setDateSelectorInput({
                                              month: "1",
                                              year: (
                                                  Number(
                                                      props.dateSelectorData
                                                          .year
                                                  ) + 1
                                              ).toString(),
                                          })
                                        : setDateSelectorInput({
                                              ...dateSlectorInput,
                                              month: (
                                                  Number(
                                                      props.dateSelectorData
                                                          .month
                                                  ) + 1
                                              ).toString(),
                                          });

                                    props.setDateSelector({
                                        ...dateSlectorInput,
                                    });
                                }}
                            >
                                vor
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
                {/* <Row>
                    <Col xs={2}>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Monat</InputGroup.Text>
                            <Form.Control
                                id="inlineFormInputGroup"
                                type="text"
                                onChange={(e) =>
                                    setCheckerInput({
                                        ...checkerInput,
                                        month: e.target.value,
                                    })
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
                                    setCheckerInput({
                                        ...checkerInput,
                                        year: e.target.value,
                                    })
                                }
                                value={checkerInput.year}
                                placeholder="Jahr"
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <Button
                            onClick={(e) =>
                                props.setDateSelector({ ...checkerInput })
                            }
                            variant="outline-success"
                        >
                            Suche
                        </Button>
                    </Col>
                </Row> */}
            </Form>
        </Fragment>
    );
}

export default DateSelector;
