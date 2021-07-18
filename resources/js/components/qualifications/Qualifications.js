import React, {Fragment, useEffect, useState} from "react";
import axios from "axios";
import Qualification from "./show/Qualification";
import Button from "../shared/Button";
import {Link} from "react-router-dom";


function Qualifications() {
    const [qualificationsData, setQualification] = useState([])

    useEffect(()=>{
        async function getData() {
            try {
                const {data} = await axios.get('http://127.0.0.1:8000/api/qualifications', {})

                setQualification(data.qualifications)
            } catch (error) {
                console.log(error)
            }
        }
        getData()


    }, [])

    // console.log(qualificationsData)


    return (
        <Fragment>
            {qualificationsData.map((qualificationObject) => <Qualification key={qualificationObject.id}
                                                                           qualificationData={qualificationObject}/>)}
            <Link to="/qualification/create">NEW</Link>
        </Fragment>

    )

}

export default Qualifications;
