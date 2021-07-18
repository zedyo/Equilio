import React, {useEffect, useState, Fragment} from "react"
import axios from "axios"
import Duty from "./single_duty/Duty";
import DateChecker from "./date_checker/DateChecker";
import moment from "moment";

function Duties() {
    const [dutiesData, setDuty] = useState(null);

    const [checkerData, setChecker] = useState(
        {
            month:`${moment().format('MM')}`,
            year:`${moment().format('YYYY')}`
        });

    const daysRowStyle = {
        display: "grid",
        gridAutoFlow: "column",
        gridTemplateColumns: "100px"
    }
    const daysStyle = {
        width: "38px"
    }

    const getDaysCount = days =>{
            let content = [];
            for (let i = 1; i <= days; i++) {
                content.push(
                    <div style={daysStyle}>
                        {i}
                    </div>
                )
            }
            return content;
        }


    useEffect( ()=>{
            async function getData() {
                const {data} = await axios.get('http://127.0.0.1:8000/api/duties/2020/01')

                setDuty(data.employees)
            }
        getData()
        }, []
    )

    return <div>
        <DateChecker checkerData={checkerData}
                     setChecker={setChecker}/>
        <div style={daysRowStyle}>
            <div/>
            <Fragment>
                {getDaysCount(moment(
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
    </div>
}

export default Duties
