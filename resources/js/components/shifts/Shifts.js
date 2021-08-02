import React, {Fragment, useEffect, useState} from "react";
import axios from "axios";
import {Button, Row, Container} from "react-bootstrap";
import Shift from "./show/Shift";

function Shifts()
{
    const [shiftsData, setShift] = useState([])

    useEffect(()=>{
        async function getData() {
            try {
                const {data} = await axios.get('http://127.0.0.1:8000/api/shifts', {})
                setShift(data.shifts)
            } catch (error) {
                console.log(error.message)
            }
        }
        getData()
    }, [])

    async function destroyData(deletedShiftsId) {
        try {
            const deleted_data = await axios.delete(`http://127.0.0.1:8000/api/shifts/${deletedShiftsId}/`)
            setShift(shiftsData.filter((shift)=>shift.id !== deleted_data.data.deleted_shift.id))
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <Fragment>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">Schichten</div>

                            <div className="card-body">
                                <Container fluid="sm">
                                    <Row>
                                        {shiftsData.map((shiftsObject) => <Shift
                                            key={shiftsObject.id}
                                            shiftsData={shiftsObject}
                                            deleteHandler={destroyData}/>)}
                                    </Row>
                                </Container>

                                <Container style={{ margin: '0.3rem' }} fluid="sm">
                                    <Button href={`/shift/create`} variant="outline-success">Erstellen</Button>{' '}
                                </Container>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Shifts;
