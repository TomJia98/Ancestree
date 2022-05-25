import React, { useState, Component, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_PERSON,
  UPDATE_PERSON,
  UPDATE_CHILDREN_AND_PARENTS,
} from "../utils/mutations";

const EditPerson = (props) => {
  const [updatePerson, { error }] = useMutation(UPDATE_PERSON);
  const [formState, setFormState] = useState({
    name: "",
    deathDate: "",
    birthday: "",
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
    console.log(event);
    console.log(formState);
    try {
      const updatingPerson = await updatePerson({
        variables: { ...formState, _ID: props.personId },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <label>
          <br></br>
          Persons Name:
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
          Persons Birthdate:
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
          Persons deathDate:
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
          Email on birthday
          <input
            className="react-switch-checkbox"
            name="isClose"
            type="checkbox"
            value={formState.isClose}
            onChange={handleChange}
          />
        </label>
        <br></br>
        <input type="submit" value="update person" />
      </form>
    </>
  );
};

export default EditPerson;
