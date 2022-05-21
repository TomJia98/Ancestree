import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_SINGLE_PERSON, QUERY_PERSONS } from '../utils/queries';
import Graph from "react-graph-vis";
import Auth from "../utils/auth";
const Main = () => {
const user = Auth.getProfile();
    // const {loading, data} = useQuery(


    // )


    const graph = {
      nodes: [
        { id: 1, label: "parent 1", title: "node 1 tootip text" },
        { id: 2, label: "parent 2", title: "node 2 tootip text" },
        { id: 3, label: "child 1", title: "node 3 tootip text" },
        { id: 4, label: "child 2", title: "node 4 tootip text" },
        // { id: 5, label: "Node 5", title: "node 5 tootip text" }
      ],
      edges: [
        { from: 1, to: 3 },
        { from: 1, to: 4 },
        { from: 2, to: 4 },
        { from: 2, to: 3 },
        // { from: 2, to: 5 }
      ]
    };
  
    const options = {
      layout: {
        hierarchical: false
      },
      edges: {
        color: "#000000"
      },
      height: "500px"
    };
  
    const events = {
      select: function(event) {
        var { nodes, edges } = event;
      }
    };


  return (
    <main>
      { Auth.loggedIn() ? (<>
        <Graph
      graph={graph}
      options={options}
      events={events}
      getNetwork={network => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    />


        </>):(<>
            <p>It looks like you are not logged in! please log in or signup <Link to="/login">here</Link></p>
        </>)}
    </main>
  );
};

export default Main;
