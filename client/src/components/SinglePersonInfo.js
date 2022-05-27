import React, { useState } from "react";
import { QUERY_SINGLE_PERSON, QUERY_PERSONS_NAME_ID } from "../utils/queries";
import convertUnixTime from "../utils/convertUnix";
import { CREATE_LINK } from "../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import AddChild from "./addChild";
import EditPerson from "./editPerson";
import CreateParents from "./createParents";
import codeGenerator from "../utils/codeGenerator";

const SinglePersonInfo = (props) => {
  let [ISADDCHILD, setISADDCHILD] = useState(false);
  let [ISEDIT, setISEDIT] = useState(false);
  let [hasParents, sethasParents] = useState();
  let [currentLinkCode, setCurrentLinkCode] = useState();

  const { loading: NIDLoading, data: NIDData } = useQuery(
    QUERY_PERSONS_NAME_ID
  );
  const user = Auth.getProfile();
  console.log(user);
  const personId = user.data.person;

  const { loading, data } = useQuery(QUERY_SINGLE_PERSON, {
    variables: { personId: props.current || personId },
  });
  const [createNewLink, { error }] = useMutation(CREATE_LINK);

  const createLink = async () => {
    const newCode = codeGenerator(9);
    const newLinkCode = await createNewLink({
      variables: {
        linkingCode: newCode,
        userWhoIsLinking: user.data._id,
        linkedToPerson: props.current,
      },
    });
    if (newLinkCode) {
      setCurrentLinkCode(newCode);
    } else setCurrentLinkCode("Something went wrong, try again");

    //use the linking code mutation to actually create the code, then return it to the user
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
          <p>{currentLinkCode}</p>
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
          <p>birthdate: {convertUnixTime(data.person.birthday)}</p>
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
