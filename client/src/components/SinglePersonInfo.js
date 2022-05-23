import React, { useState } from "react";
import { QUERY_SINGLE_PERSON } from "../utils/queries";
import { useQuery } from "@apollo/client";
import Auth from "../utils/auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import AddChild from "./addChild";
const SinglePersonInfo = (props) => {
  let [ISADDCHILD, setISADDCHILD] = useState(false);

  const user = Auth.getProfile();
  const personId = user.data.person;
  const { loading, data } = useQuery(QUERY_SINGLE_PERSON, {
    variables: { personId: props.current || personId },
  });
  const addChildShow = () => {
    setISADDCHILD(true);
  };
  const addChildHide = () => {
    setISADDCHILD(false);
  };

  return (
    <>
      {loading ? (
        <>
          <p>loading...</p>
        </>
      ) : (
        <>
          <p>name :{data.person.name}</p>
          <p>birthday: {data.person.birthday}</p>
          <p>children: {data.person.children.length}</p>
          <button onClick={addChildShow}>add child</button>
          {ISADDCHILD ? (
            <>
              <AddChild
                personId={data.person._id}
                addChildHide={addChildHide}
              ></AddChild>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};
export default SinglePersonInfo;
