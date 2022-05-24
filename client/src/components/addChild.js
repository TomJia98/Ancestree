import React, { useState, Component } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  QUERY_SINGLE_PERSON,
  QUERY_PERSONS,
  QUERY_PERSONS_NAME_ID,
} from "../utils/queries";
import { ADD_PERSON, UPDATE_PERSON } from "../utils/mutations";
import Auth from "../utils/auth";
import CreatableSelect from "react-select/creatable";
//TODO: get the props from singlepersoninfo component and add them to the options for parents names
//with an option for a new person if that selected
//finish the other inputs, need a boolean slider for isClose
const AddChild = (props) => {
  let newParentName = null;
  const { loading: allLoading, data: allData } = useQuery(QUERY_PERSONS);
  const { loading: currentLoading, data: currentData } = useQuery(
    QUERY_SINGLE_PERSON,
    {
      variables: { personId: props.personId },
    }
  );
  const namesAndIds = props.personsIdAndNameArr.persons;
  let options = [];
  namesAndIds.forEach((el) => {
    //add the ids and names of the current people to the options for the drop down
    const obj = { value: el._id, label: el.name };
    options.push(obj);
  });

  const handleMultiChange = (e) => {
    console.log(e);
    if (!options.find((x) => x.value === e[0].value)) {
      console.log("parent not found, creating new");
      console.log(e[0].value);
      //if the selected name is new
      newParentName = e[0].value;
      return;
      //create new person based on the new inputted name, and save them as a parent to the child being added
    }
    setFormState({ ...formState, parents: [e.value, props.personId] });
  };

  const [createPerson, { error: addError }] = useMutation(ADD_PERSON);
  const [updatePerson, { error: updateError }] = useMutation(UPDATE_PERSON);
  const [formState, setFormState] = useState({
    name: "",
    deathDate: "",
    birthday: "",
    parents: [],
    children: [],
    isClose: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      if (newParentName !== null) {
        console.log(newParentName);
        const newBlankParent = await createPerson({
          //creating the new parent
          variables: { name: newParentName, isClose: false },
        });
        const NewParentId = newBlankParent.data.addPerson._id;
        console.log(newBlankParent);
        const newParentAndChild = await createPerson({
          //creating the new child and adding the current user and new parent
          variables: {
            name: formState.name,
            deathDate: formState.deathDate,
            birthday: formState.birthday,
            birthday: formState.birthday,
            parents: [NewParentId, props.personId],
            children: [],
            isclose: formState.isClose,
          },
        });
        const newChildId = newParentAndChild.data.addPerson._id;
        await updatePerson({
          //updating the blank parent with the new childs id
          variables: { _ID: NewParentId, children: [newChildId] },
        });
        const currentChildren = currentData.person.children;
        if (currentChildren.length === 0) {
          await updatePerson({
            variables: {
              _ID: props.personId, //updating the current logged in person with new child
              children: [newChildId],
            },
          });
        } else {
          console.log(currentData);
          currentChildren.push(newChildId);
          await updatePerson({
            variables: {
              _ID: props.personId, //updating the current logged in person with new child
              children: [currentChildren],
            },
          });
        }
        setFormState({
          name: "",
          deathDate: "",
          birthday: "",
          parents: [],
          children: [],
          isClose: false,
        });
        props.addChildShow(); //close the add child section upon completion
      } //create new parent and new child complete, below need to do for existing parent
      else {
        const newChild = await createPerson({
          variables: { ...formState },
        });
        // for(let i = 0; i<newChild.parents.length; i++){
        // const parentToAdd = await

        // }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label>
          <br></br>
          Childs Name:
          <input
            className="form-input"
            placeholder="Childs Name"
            name="name"
            type="text"
            value={formState.name}
            onChange={handleChange}
          />
        </label>
        <br></br>
        <label>
          Childs Birthdate:
          <input
            className="form-input"
            placeholder=" birthday"
            name="birthday"
            type="date"
            value={formState.birthday}
            onChange={handleChange}
          />
        </label>
        <br></br>
        <label>
          Childs deathDate:
          <input
            className="form-input"
            placeholder="deathDate"
            name="deathDate"
            type="date"
            value={formState.deathDate}
            onChange={handleChange}
          />
        </label>
        <br></br>
        <label>
          Other Parent:
          <CreatableSelect
            isMulti={true}
            value={formState.parents}
            options={options}
            closeMenuOnSelect={false}
            onChange={handleMultiChange}
          />
        </label>
        <br></br>
        <label>
          Email on birthday
          <input
            className="react-switch-checkbox"
            name="isClose"
            type="checkbox"
          />
        </label>

        <input type="submit" value="Add Child" />
      </form>
    </div>
  );
};

export default AddChild;
