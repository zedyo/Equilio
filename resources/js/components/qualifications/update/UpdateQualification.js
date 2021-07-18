import React, {Fragment, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";


function UpdateQualification(props) {

    const params = useParams()
    const [qualificationsData, setQualification] = useState([])

    useEffect(()=>{
        async function getData() {
            try {
                const {data} = await axios.get(`http://127.0.0.1:8000/api/qualifications/${params.id}/`, {})
                setQualification(data.qualification)
            } catch (error) {
                console.log(error)
            }
        }
        getData()

    }, [])

    console.log(qualificationsData)

    return (
        <Fragment>
            <h1>{qualificationsData.id}</h1>
            <input type="text" value={qualificationsData.description}/>
        </Fragment>
    )


}

export default UpdateQualification
