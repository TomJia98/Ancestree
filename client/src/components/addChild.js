import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_SINGLE_PERSON, QUERY_PERSONS } from "../utils/queries";
import { ADD_PERSON, UPDATE_PERSON } from "../utils/mutations";

const AddChild = (props) => {
  return <p>addChild form</p>;
};

export default AddChild;
