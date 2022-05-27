import React, { useState } from "react";
import {
  ADD_PERSON,
  UPDATE_PERSON,
  UPDATE_CHILDREN_AND_PARENTS,
} from "../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";

const CreateParents = (props) => {
  const [ADDPARENTS, setADDPARENTS] = useState(false);
  const [formState, setFormState] = useState({
    name1: "",
    name2: "",
    children: [props.personId],
    createdBy: [props.createdBy],
  });

  const [createPerson, { error: addError }] = useMutation(ADD_PERSON);

  const [updatePersonRels, { error: updateRelsError }] = useMutation(
    UPDATE_CHILDREN_AND_PARENTS
  );
  const AddParents = () => {
    setADDPARENTS(true);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const parent1 = await createPerson({
      variables: {
        name: formState.name1,
        children: formState.children,
        createdBy: formState.createdBy,
      },
    });
    const parent2 = await createPerson({
      variables: {
        name: formState.name2,
        children: formState.children,
        createdBy: formState.createdBy,
      },
    });
    const parentsArr = [parent1.data.addPerson._id, parent2.data.addPerson._id];

    const addingParents = await updatePersonRels({
      variables: { _ID: props.personId, parents: parentsArr },
    });
    console.log(addingParents);
  };

  return (
    <div>
      {ADDPARENTS ? (
        <>
          <form onSubmit={handleFormSubmit}>
            <label>
              <br></br>
              first parents name
              <input
                className="form-input"
                placeholder="parent 1 Name"
                name="name1"
                type="text"
                value={formState.name1}
                onChange={handleChange}
              />
            </label>
            <br></br>
            <label>
              <br></br>
              second parents name
              <input
                className="form-input"
                placeholder="parent 2 Name"
                name="name2"
                type="text"
                value={formState.name2}
                onChange={handleChange}
              />
            </label>
            <br></br>
            <input type="submit" value="Add Parents" />
          </form>
        </>
      ) : (
        <>
          <button onClick={AddParents}>Add Parents</button>
        </>
      )}
    </div>
  );
};

export default CreateParents;
//needs to be able to create two new parents, and be able to link to existing children
