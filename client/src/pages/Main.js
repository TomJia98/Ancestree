import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@apollo/client";
import { QUERY_SINGLE_PERSON, QUERY_PERSONS } from "../utils/queries";
import Graph from "react-graph-vis";
import Auth from "../utils/auth";
import SinglePersonInfo from "../components/SinglePersonInfo";

let LEVEL = 0;
const Main = () => {
  let graph1;
  const user = Auth.getProfile();
  const [selectedNode, setSelectedNode] = useState(""); //add the logged in users person here as default

  const [isGraphFinished, setIsGraph] = useState(false);
  const personId = user.data.person;

  const { loading: allLoading, data: allData } = useQuery(QUERY_PERSONS);

  // if (allData) {
  //   console.log(allData);
  //   console.log("this is the alldata");
  //   setIsGraph(true);
  // }
  const { loading, data: userData } = useQuery(QUERY_SINGLE_PERSON, {
    variables: { personId },
  });

  let [graphKey, setGraphKey] = useState(uuidv4);

  let [graph, setGraph] = useState({
    nodes: [],
    edges: [],
  });

  if (allData && !isGraphFinished) {
    console.log("==============");
    const allPeople = allData.persons;
    const peopleNodeArr = [];
    const peopleEdgeArr = [];

    allPeople.forEach((el) => {
      let personNode;
      if (el.isLinked) {
        personNode = { id: el._id, label: el.name, color: "red" };
      } else {
        personNode = { id: el._id, label: el.name };
      }
      peopleNodeArr.push(personNode);
      let personEdge = [];
      for (let i = 0; i < el.children.length; i++) {
        let edge = { from: el._id, to: el.children[i] };
        personEdge.push(edge);
      }
      peopleEdgeArr.push.apply(peopleEdgeArr, personEdge);
    });
    console.log(peopleNodeArr);
    console.log(peopleEdgeArr);
    console.log("all data is above this one");
    let newGraph = { nodes: peopleNodeArr, edges: peopleEdgeArr };
    console.log(newGraph);
    setGraph(newGraph);
    setIsGraph(true);
  }

  //add logic for adding new people to the graph

  /* need to add a search function to return all people that dont have parents (starts of the familylines)
then loops through the returned array of people and adds their nodes to the graph
then searches if they have children
if they do, add an edge to each child, and add it to the graph, whilst checking if the*/

  const options = {
    layout: {
      hierarchical: { enabled: true, sortMethod: "directed" },
    },
    edges: {
      color: "#000000",
    },
    height: "500px",
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
      console.log(nodes[0]);
      console.log(edges);
      setSelectedNode(nodes[0]);
    },
  };

  return (
    <main>
      {Auth.loggedIn() ? (
        <>
          <SinglePersonInfo current={selectedNode} />
          {isGraphFinished ? (
            <>
              <Graph
                key={graphKey}
                graph={graph}
                options={options}
                events={events}
                getNetwork={(network) => {
                  //  if you want access to vis.js network api you can set the state in a parent component using this property
                }}
              />
            </>
          ) : (
            <>
              <p>family tree is being rendered</p>
            </>
          )}
        </>
      ) : (
        <>
          <p>
            It looks like you are not logged in! please log in or signup
            <Link to="/login">here</Link>
          </p>
        </>
      )}
    </main>
  );
};

export default Main;
