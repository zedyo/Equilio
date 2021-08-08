import React, {useEffect, useState, Fragment} from "react"
import axios from "axios"
import Duty from "./single_duty/Duty";
import DateChecker from "./date_checker/DateChecker";
import moment from "moment";
import {Container} from "react-bootstrap";


function Duties()
{
    moment.locale("de")
    const [dutiesData, setDuty] = useState(null);

    const [checkerData, setChecker] = useState(
        {
            month:`${moment().format('M')}`,
            year:`${moment().format('YYYY')}`
        });

    const daysRowStyle = {
        display: "grid",
        gridAutoFlow: "column",
        gridTemplateColumns: "150px"
    }
    const daysStyle = {
        width: "28px"
    }

    const getDaysCount = days =>{
            let content = [];
            for (let i = 1; i <= days; i++) {
                content.push(
                    <Fragment>
                        <div style={daysStyle}>
                            {i}
                        </div>
                    </Fragment>
                )
            }
            return content;
        }

    const getWeekdays = weekdays => {
        let content = [];
        for (let i = 1; i <= weekdays; i++) {
            content.push(
                <div style={daysStyle}>
                    {moment(
                        `${checkerData.year}-${checkerData.month}-${i}`,
                        "YYYY-MM-DD")
                        .format("ddd")}
                </div>
            )
        }
        return content;
    }

    useEffect( ()=>{
            async function getData() {
                const {data} = await axios.get('http://127.0.0.1:8000/api/duties/')

                setDuty(data.employees)
            }
        getData()
        }, []
    )

    return <div>
        <Container>
            <DateChecker checkerData={checkerData}
                         setChecker={setChecker}/>
            <div style={daysRowStyle}><div/>
                <Fragment>
                    {getDaysCount(moment(
                        `${checkerData.year}-${checkerData.month}`,
                        "YYYY-MM")
                        .daysInMonth())}
                </Fragment>
            </div>
            <div style={daysRowStyle}><div/>
                <Fragment>
                    {getWeekdays(moment(
                        `${checkerData.year}-${checkerData.month}`,
                        "YYYY-MM")
                        .daysInMonth())}
                </Fragment>
            </div>
            <div>
                {dutiesData && dutiesData.map( (dutyObject) => <Duty key={dutyObject.id}
                                                                     dutiesData={dutyObject}
                                                                     checkerData={checkerData}/>)}
                {/* Hier könnte im Else ein Loading Spinner kommen!*/}
                {/*{dutiesData ? dutiesData.map( (dutyObject) => <Duty key={dutyObject.id} dutiesData={dutyObject}/>) : "Nix!"}*/}
            </div>
        </Container>
    </div>
}

export default Duties
