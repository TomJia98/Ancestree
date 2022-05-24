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
import AsyncCreatableSelect from "react-select/async-creatable";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
//TODO: get the props from singlepersoninfo component and add them to the options for parents names
//with an option for a new person if that selected
//finish the other inputs, need a boolean slider for isClose
const AddChild = (props) => {
  const handleMultiChange = (e) => {
    console.log("something shaveofaf");
    console.log(e);
  };

  class WithPromises extends Component {
    render() {
      const PromiseOptions = async (inputValue) => {
        const { loading, data } = useQuery(QUERY_PERSONS_NAME_ID);
        if (!loading) {
          let returnData;
          console.log(data);
          console.log("the data from that new query");
        }
        return [
          { value: "a", label: "a" },
          { value: "b", label: "b" },
        ];
      };

      return (
        <AsyncCreatableSelect
          isMulti
          cacheOptions
          defaultOptions
          onChange={handleMultiChange}
          loadOptions={PromiseOptions}
        />
      );
    }
  }

  const { loading: allLoading, data: allData } = useQuery(QUERY_PERSONS);

  const namesAndIds = props.personsIdAndNameArr.persons;
  console.log(namesAndIds);
  let options = [
    { value: "a", label: "a" },
    { value: "b", label: "b" },
  ];
  namesAndIds.forEach((el) => {
    //add the ids and names of the current people to the options for the drop down
    const obj = { value: el._id, label: el.name };
    options.push(obj);
  });
  console.log(options);
  const [createPerson, { error: addError }] = useMutation(ADD_PERSON);
  const [updatePerson, { error: updateError }] = useMutation(UPDATE_PERSON);
  const [formState, setFormState] = useState({
    name: "",
    deathDate: "",
    birthday: "",
    parents: "",
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
      const newParents = [formState.parents, props.personId]; //adding the currently selected person as a parent
      const response = await createPerson({
        //adding the createdBy arr is done serverside
        variables: {
          name: formState.name,
          deathDate: formState.deathDate,
          birthday: formState.birthday,
          parents: newParents,
          children: [],
          isClose: formState.isClose,
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
      parents: "",
      children: [],
      isClose: false,
    });
  };

  return (
    <div>
      <input
        className="form-input"
        placeholder="Your name"
        name="name"
        type="text"
        value={formState.name}
        onChange={handleChange}
      />
      <input
        className="form-input"
        placeholder=" Your Birthday"
        name="birthday"
        type="date"
        value={formState.birthday}
        onChange={handleChange}
      />
      <input
        className="form-input"
        placeholder=" Your Birthday"
        name="birthday"
        type="date"
        value={formState.birthday}
        onChange={handleChange}
      />
      <CreatableSelect
        isMulti={true}
        options={options}
        closeMenuOnSelect={false}
        onChange={handleMultiChange}
      />
    </div>
  );
};

export default AddChild;
