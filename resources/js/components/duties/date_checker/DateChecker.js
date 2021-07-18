import React, {Fragment, useState} from "react"

function DateChecker(props) {

    // function formDataHandler(e) {
    //     e.preventDefault()
        // console.log(moment(`${checkerData.year}-${checkerData.month}`, "YYYY-MM").daysInMonth())
    // }

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