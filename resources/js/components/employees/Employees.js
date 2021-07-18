import React, {useEffect, useState} from "react"
import axios from "axios"
import Employee from "./show/Employee";
// Import von React (mit useEffect, useState), axios und Employee.js


function Employees() {

    // const [employeesData, setEmployee] = useState({});
    const [employeesData, setEmployee] = useState([]);
    // const [inputState, setInputState] = useState("Ahoi!")
    // useState ein React Werkzeug. Im Parameter wird der Defaultwert gesetzt (hier [])
    // useState zwischenspeichert etwas in den State
    // [] = Array Destructioning -> ich vergebe 2 Variablen für 2 Returnwerte von useState
    // 1. Param: employeesData hällt Daten (die im [] stehen) die später für return verwendet werden
    // 2. Param: setEmployee sammelt Daten (in die []) die in den 1. Param kommen


    useEffect( ()=>{
        // ()=>{} ist eine Anonyme "wegwerf" Methode die nur hier verwendet wird
        // useEffect ist ein Reakt Werkzeug. "LifeCycle Methode" Mit jeder Änderung -> Trigger -> aktualisieren.

        async function getData() {
            // async function - damit asynchroner Datenaustausch möglich ist

            // const {data} = await axios.get('http://127.0.0.1:8000/api/employees/1')
            const {data} = await axios.get('http://127.0.0.1:8000/api/employees')
            console.log(data)
            // data sind die empfangen PHP Daten (mithilfe axios)

            setEmployee(data.employees)
            // setEmployee(data.employee)
            // data.employees ~ 'employees' daten aus den empfangen PHP Daten, werden in setEmployee gegeben
        }

        // Die eben geschriebene getData Methode wird hier ausgeführt
        getData()

    }, [])
    // [] = "Aktiviere useEffect nur wenn du die Seite lädst. Nur 1x!!!" .
    // employeeData od. inputState -> Überwache das! und Ändere das jedes mal wenn sich da was ändert!
    // Man kann meherere Variablen hier reinbringen die überwacht werden sollen.

    return (

    // <Employee  employeeData={employeesData}/>
       employeesData.map( (employeeObject) => <Employee key={employeeObject.id} employeeData={employeeObject}/> )
        // .map ist eine Standard Array Methode von JS - Es itteriert und speichert die einzelnen Iterationen ab
        // employeeObject ist der Parameter in der Anonyme Function
        // <Employee /> ist der Aufruf von dem Component was importiert wurde
        // Key: Für React, damit es damit arbeiten kann.
    );
}

export default Employees
