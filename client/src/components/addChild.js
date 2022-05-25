import React, { useState, Component, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  QUERY_SINGLE_PERSON,
  QUERY_PERSONS,
  QUERY_PERSONS_NAME_ID,
} from "../utils/queries";
import {
  ADD_PERSON,
  UPDATE_PERSON,
  UPDATE_CHILDREN_AND_PARENTS,
} from "../utils/mutations";
import Auth from "../utils/auth";
import CreatableSelect from "react-select/creatable";
//TODO: get the props from singlepersoninfo component and add them to the options for parents names
//with an option for a new person if that selected
//finish the other inputs, need a boolean slider for isClose
const AddChild = (props) => {
  const [newParentName, setNewParentName] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    deathDate: "",
    birthday: "",
    parents: [],
    children: [],
    isClose: false,
  });

  const [selectVal, setSelectVal] = useState("");

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
    console.log(e.label);
    setSelectVal(e.label);
    console.log(selectVal);
    if (!options.find((x) => x.value === e.value)) {
      console.log("parent not found, creating new");
      console.log(e.value);
      //if the selected name is new
      setNewParentName(e.value);
      console.log(newParentName);
      return;
      //create new person based on the new inputted name, and save them as a parent to the child being added
    }
    setFormState({ ...formState, parents: [e.value, props.personId] });
  };

  // useEffect(() => { // trying to get the selected person to appear in the select box. currently displaying above
  //   if (selectVal) {
  //     const option = options.find((option) => option.value === selectVal.value);
  //     if (option && option.label !== selectVal.label) {
  //       setSelectVal(option);
  //     }
  //   }
  // }, [formState, options]);
  const [createPerson, { error: addError }] = useMutation(ADD_PERSON);
  const [updatePerson, { error: updateError }] = useMutation(UPDATE_PERSON);
  const [updatePersonRels, { error: updateRelsError }] = useMutation(
    UPDATE_CHILDREN_AND_PARENTS
  );

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
    console.log(newParentName);
    try {
      if (newParentName !== null) {
        console.log(newParentName);
        console.log("entering the new parent name");
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
        let currentChildren = currentData.person.children;
        if (currentChildren.length === 0) {
          await updatePerson({
            variables: {
              _ID: props.personId, //updating the current logged in person with new child
              children: [newChildId],
            },
          });
        } else {
          console.log(currentChildren);
          console.log(newChildId);
          let currentChildren2 = [...currentChildren, newChildId];
          console.log(currentChildren2);

          await updatePerson({
            variables: {
              _ID: props.personId, //updating the current logged in person with new child
              children: currentChildren2,
            },
          });
        }
        setNewParentName(null);
        setFormState({
          name: "",
          deathDate: "",
          birthday: "",
          parents: [],
          children: [],
          isClose: false,
        });
        props.addChildHide(); //close the add child section upon completion
      } //create new parent and new child complete, below need to do for existing parent
      else {
        const newChild = await createPerson({
          variables: { ...formState },
        });
        let newChildActual = newChild.data.addPerson;
        console.log(newChild);
        for (let i = 0; i < newChildActual.parents.length; i++) {
          const parentToAdd = await updatePersonRels({
            variables: {
              _ID: newChildActual.parents[i],
              children: newChildActual._id,
            },
          });
          console.log(parentToAdd);
          console.log("here is parents to add result");
        }
        setNewParentName(null);
        setFormState({
          name: "",
          deathDate: "",
          birthday: "",
          parents: [],
          children: [],
          isClose: false,
        });
        props.addChildHide();
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
          Other Parent: {selectVal}
          <CreatableSelect
            isMulti={false}
            value={selectVal}
            options={options}
            closeMenuOnSelect={true}
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
