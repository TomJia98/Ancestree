import React, { useState, Component } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_SINGLE_PERSON, QUERY_PERSONS } from "../utils/queries";
import { ADD_PERSON, UPDATE_PERSON } from "../utils/mutations";
import Auth from "../utils/auth";
import AsyncCreatableSelect from "react-select/async-creatable";

const AddChild = (props) => {
  const handleMultiChange = (e) => {
    console.log("something shaveofaf");
    console.log(e);
  };

  class WithPromises extends Component {
    render() {
      const PromiseOptions = async (inputValue) => {
        //   const { loading, data } = useQuery(QUERY_PERSONS_NAME_ID);
        //   if (data) {
        //     let returnData;
        //     console.log(data);
        //     console.log("the data from that new query");
        //   }
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

  //   const user = Auth.getProfile();
  //   const personId = user.data.person;
  //   const userId = user.data._id;
  // this was for adding the createdBy, but that is done serverside

  const { loading: allLoading, data: allData } = useQuery(QUERY_PERSONS);

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
      <WithPromises
        isMulti={true}
        // options={options}
        closeMenuOnSelect={false}
        onChange={handleMultiChange}
      />
    </div>
  );
};

export default AddChild;
