import React, {Fragment} from "react"

function DateChecker(props)
{
    return <Fragment>
        <input type="text"
               onChange={(e) => props.setChecker({...props.checkerData, month:e.target.value})}
               value={props.checkerData.month}
               placeholder="Month"/>
        <input type="text"
               onChange={(e) => props.setChecker({...props.checkerData, year:e.target.value})}
               value={props.checkerData.year}
               placeholder="Year"/>
    </Fragment>
}

export default DateChecker
