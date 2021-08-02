import React, {Fragment, useEffect, useState} from "react"
import axios from "axios"
import Employee from "./show/Employee";
import {Button, Card, Container, Table} from "react-bootstrap";

function Employees()
{
    const [employeesData, setEmployee] = useState([]);
    // --MEMO useState--
    // useState ein React Werkzeug. Im Parameter wird der Defaultwert gesetzt (hier [])
    // useState zwischenspeichert etwas in den State
    // 1. Param: employeesData hällt Daten (die im inital State [] stehen) die später für return verwendet werden
    // 2. Param: setEmployee sammelt Daten (in die State []) die später im 1. Param gebraucht werden
    // useEffect ist ein Reakt Werkzeug. "LifeCycle Methode" Mit jeder Änderung -> Trigger -> aktualisieren.

    // --MEMO Array destructioring---
    // const [var1, var2] = blahMethode() -> ich vergebe 2 Variablen für 2 Returnwerte von blahMethode

    useEffect( ()=>{
        // --MEMO Anonyme Methoden--
        // ()=>{} ist eine Anonyme "wegwerf" Methode die nur hier verwendet wird

        async function getData() {
            // --MEMO async function--
            // async Funktion - damit asynchroner Datenaustausch möglich ist

            const {data} = await axios.get('http://127.0.0.1:8000/api/employees')
            // --MEMO data und axios
            // data sind die empfangen PHP Daten (mithilfe axios)

            setEmployee(data.employees)
            // --MEMO data.employees--
            // data.employees ~ 'employees' Array daten aus den empfangen PHP Daten, werden in setEmployee gegeben
        }

        getData()
    }, [])
    // --MEMO deps--
    // [] = "Aktiviere useEffect nur wenn du die Seite lädst. Nur 1x!!!" .
    // employeeData od. inputState (egal was) -> "Überwache das! und Ändere das jedes mal wenn sich da was ändert!"
    // Man kann mehrere Variablen hier reinbringen die dann explizit überwacht werden sollen.

    async function destroyData(deletedEmployeeId) {
        try {
            const deleted_data = await axios.delete(`http://127.0.0.1:8000/api/employees/${deletedEmployeeId}/`)
            setEmployee(employeesData.filter((employee)=>employee.id !== deleted_data.data.deleted_employee.id))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Fragment>
            <Container>
                <Card>
                    <Card.Header>Angestellten Übersicht</Card.Header>
                    <Card.Body>
                        <Table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Vorname</th>
                                    <th>Nachname</th>
                                    <th>Qualifikation</th>
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeesData.map( (employeeObject) => <Employee key={employeeObject.id}
                                                                                  employeeData={employeeObject}
                                                                                  deleteHandler={destroyData}/>)}
                            </tbody>
                        </Table>
                        <Container fluid="sm">
                            <Button href={`/employee/create`} variant="outline-success">Erstellen</Button>{' '}
                        </Container>
                    </Card.Body>
                </Card>
            </Container>
        </Fragment>

        // --MEMO .map, key--
        // .map ist eine Standard Array Methode von JS - Es itteriert und speichert die einzelnen Iterationen ab
        // employeeObject ist der Parameter in der Anonyme Function
        // key: Für React, damit es damit arbeiten kann.
    );
}

export default Employees
