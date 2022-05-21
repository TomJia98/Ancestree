import React, { useState } from "react";
import { QUERY_SINGLE_PERSON, } from '../utils/queries';
import { useQuery } from "@apollo/client";
import Auth from "../utils/auth";



const SinglePersonInfo = (props) => {
    const user = Auth.getProfile();
  const {loading, data} = useQuery( QUERY_SINGLE_PERSON,{

    variables:{personId:user.data._id}
  })
    console.log(props)
    console.log(user.data)



return (<>

    <p>{data}</p>
    </>
)



};
export default SinglePersonInfo;