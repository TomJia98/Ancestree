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
  const { loading: allLoading, data: allData } = useQuery(QUERY_PERSONS);

  const namesAndIds = props.personsIdAndNameArr.persons;
  let options = [];
  namesAndIds.forEach((el) => {
    //add the ids and names of the current people to the options for the drop down
    const obj = { value: el._id, label: el.name };
    options.push(obj);
  });

  const handleMultiChange = (e) => {
    console.log(e);
    setFormState({ ...formState, parents: [e.value, props.personId] });
    //     if(options.find((x =>x.value === e.value)===undefined)){
    // //create new person based on the new inputted name, and save them as a parent to the child being added

    //     }
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
    try {
      const response = await createPerson({
        //adding the createdBy arr is done serverside
        variables: {
          ...formState,
        },
      });
      if (!response.data) {
        throw new Error("something went wrong!");
      }
      console.log(response);
    } catch (e) {
      console.error(e);
    }

    setFormState({
      name: "",
      deathDate: "",
      birthday: "",
      parents: [],
      children: [],
      isClose: false,
    });
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
