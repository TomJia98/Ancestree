import React, { useState } from "react";
import { QUERY_SINGLE_PERSON, QUERY_PERSONS_NAME_ID } from "../utils/queries";
import { useQuery } from "@apollo/client";
import Auth from "../utils/auth";
import { Link } from "react-router-dom";
import AddChild from "./addChild";
import EditPerson from "./editPerson";
import CreateParents from "./createParents";

const SinglePersonInfo = (props) => {
  let [ISADDCHILD, setISADDCHILD] = useState(false);
  let [ISEDIT, setISEDIT] = useState(false);
  let [hasParents, sethasParents] = useState();
  const { loading: NIDLoading, data: NIDData } = useQuery(
    QUERY_PERSONS_NAME_ID
  );
  const user = Auth.getProfile();
  const personId = user.data.person;

  const { loading, data } = useQuery(QUERY_SINGLE_PERSON, {
    variables: { personId: props.current || personId },
  });

  const createLink = () => {
    console.log();
  };

  const addChildShow = () => {
    if (ISADDCHILD) {
      setISADDCHILD(false);
    } else setISADDCHILD(true);
    setISEDIT(false);
  };

  const addEditShow = () => {
    if (ISEDIT) {
      setISEDIT(false);
    } else setISEDIT(true);
    setISADDCHILD(false);
  };
  return (
    <>
      {props.current ? (
        <>
          <button onClick={createLink}>Create linking code</button>
        </>
      ) : (
        <></>
      )}
      {loading ? (
        <>
          <p>loading...</p>
        </>
      ) : (
        <>
          <p>name :{data.person.name}</p>
          <p>birthday: {data.person.birthday}</p>
          <p>children: {data.person.children.length}</p>
          {data.person.parents.length ? (
            <></>
          ) : (
            <>
              <CreateParents
                personId={data.person._id}
                createdBy={data.person.createdBy}
              />
            </>
          )}
          <button onClick={addChildShow}>new child</button>
          <button onClick={addEditShow}>edit current person</button>
          {ISADDCHILD ? (
            <>
              <AddChild
                personId={data.person._id}
                addChildHide={addChildShow}
                personsIdAndNameArr={NIDData}
                createdBy={data.person.createdBy}
              ></AddChild>
            </>
          ) : (
            <></>
          )}
          {ISEDIT ? (
            <>
              <EditPerson personId={data.person._id}></EditPerson>
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
