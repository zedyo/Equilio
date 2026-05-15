import React from 'react'
import { Button, Form, Col, Row, InputGroup } from 'react-bootstrap'
import moment from 'moment'
import './DateSelector.scss'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

function DateSelector(props) {
  return (
    <>
      <Form>
        <Row>
          <Col xs="auto">
            <InputGroup className="mb-3">
              <Button
                variant="outline-secondary"
                size="text"
                id="prev-month-button"
                onClick={(e) => {
                  props.dateSelectorData.month === '1'
                    ? props.setDateSelector({
                        month: '12',
                        year: (
                          Number(props.dateSelectorData.year) - 1
                        ).toString(),
                      })
                    : props.setDateSelector({
                        ...props.dateSelectorData,
                        month: (
                          Number(props.dateSelectorData.month) - 1
                        ).toString(),
                      })
                }}
              >
                <IoChevronBack />
              </Button>
              <Form.Control
                className="dateView"
                placeholder={`${moment(
                  `${props.dateSelectorData.month}`,
                  'M'
                ).format('MMMM')} ${props.dateSelectorData.year}`}
                disabled
                size="text"
              />
              <Button
                variant="outline-secondary"
                size="text"
                id="next-month-button"
                onClick={(e) => {
                  props.dateSelectorData.month === '12'
                    ? props.setDateSelector({
                        month: '1',
                        year: (
                          Number(props.dateSelectorData.year) + 1
                        ).toString(),
                      })
                    : props.setDateSelector({
                        ...props.dateSelectorData,
                        month: (
                          Number(props.dateSelectorData.month) + 1
                        ).toString(),
                      })
                }}
              >
                <IoChevronForward />
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
    </>
  )
}

export default DateSelector
