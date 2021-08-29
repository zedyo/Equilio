import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { Button, Row, Container } from "react-bootstrap";
import ShiftType from "./show/ShiftType";

function ShiftTypes() {
    const [shiftTypeData, setShiftType] = useState([]);

    useEffect(() => {
        async function getData() {
            const { data } = await axios.get(
                "http://127.0.0.1:8000/api/shift_types",
                {}
            );
            setShiftType(data.shift_types);
        }
        getData();
    }, []);

    async function destroyData(deletedShiftTypeId) {
        try {
            const deleted_data = await axios.delete(
                `http://127.0.0.1:8000/api/shift_types/${deletedShiftTypeId}/`
            );
            setShiftType(
                shiftTypeData.filter(
                    (shift_type) =>
                        shift_type.id !==
                        deleted_data.data.deleted_shift_type.id
                )
            );
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Fragment>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">Schicht Arten</div>

                            <div className="card-body">
                                <Container fluid="sm">
                                    <Row>
                                        {shiftTypeData.map(
                                            (shiftTypeObject) => (
                                                <ShiftType
                                                    key={shiftTypeObject.id}
                                                    shiftTypeData={
                                                        shiftTypeObject
                                                    }
                                                    deleteHandler={destroyData}
                                                />
                                            )
                                        )}
                                    </Row>
                                </Container>

                                <Container
                                    style={{ margin: "0.3rem" }}
                                    fluid="sm"
                                >
                                    <Button
                                        href={`/shift_type/create`}
                                        variant="outline-success"
                                    >
                                        Erstellen
                                    </Button>{" "}
                                </Container>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default ShiftTypes;
