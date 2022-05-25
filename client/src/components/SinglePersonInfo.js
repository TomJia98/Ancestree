import React, { useState } from "react";
import { QUERY_SINGLE_PERSON, QUERY_PERSONS_NAME_ID } from "../utils/queries";
import { useQuery } from "@apollo/client";
import Auth from "../utils/auth";
import { Link } from "react-router-dom";
import AddChild from "./addChild";
import EditPerson from "./editPerson";
const SinglePersonInfo = (props) => {
  let [ISADDCHILD, setISADDCHILD] = useState(false);
  let [ISEDIT, setISEDIT] = useState(false);

  const { loading: NIDLoading, data: NIDData } = useQuery(
    QUERY_PERSONS_NAME_ID
  );
  // TODO: pass through the people with id and name into the addChild element
  const user = Auth.getProfile();
  const personId = user.data.person;
  const { loading, data } = useQuery(QUERY_SINGLE_PERSON, {
    variables: { personId: props.current || personId },
  });
  const addChildShow = () => {
    if (ISADDCHILD) {
      setISADDCHILD(false);
    } else setISADDCHILD(true);
  };

  const addEditShow = () => {
    if (ISEDIT) {
      setISEDIT(false);
    } else setISEDIT(true);
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
          <button onClick={addChildShow}>new child</button>
          <button onClick={addEditShow}>edit current person</button>
          {ISADDCHILD ? (
            <>
              <AddChild
                personId={data.person._id}
                addChildHide={addChildShow}
                personsIdAndNameArr={NIDData}
              ></AddChild>
            </>
          ) : (
            <></>
          )}
          {ISEDIT ? (
            <>
              <EditPerson></EditPerson>
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
