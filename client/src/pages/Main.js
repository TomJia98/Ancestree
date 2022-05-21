import React, { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'
// import { useQuery } from "@apollo/client";
// import { QUERY_SINGLE_PERSON, QUERY_PERSONS } from '../utils/queries';
import Graph from "react-graph-vis";
import Auth from "../utils/auth";
import SinglePersonInfo from "../components/SinglePersonInfo"
const Main = () => {
  
  let [graphKey, setGraphKey] = useState(uuidv4)
  const [selectedNode, setSelectedNode] = useState("")//add the logged in users person here as default

// const user = Auth.getProfile();
    // const {loading, data} = useQuery(


    // )

//ideas for how to graph out the data
//need to go to the first parent,(parents==0) then search for children in a loop. for each child layer searched, increase the level by 1 
    const graph = {
      nodes: [
        { id: "parent 1", label: "parent 1", title: "node 1 tootip text" , level: 1},
        //to add a new line, use \n. size of nodes adapts to the change in text
        { id: 2, label: "parent 2", title: "node 2 tootip text", level: 1},
        { id: "child 2", label: "child 2", title: "node 4 tootip text", level: 2},
        { id: 3, label: "child 1", title: "node 3 tootip text", level: 2},
        { id: 5, label: "child 3", title: "node 4 tootip text", level: 2},
        { id: 6, label: "parent 3", title: "node 4 tootip text", level: 1},
        { id: 7, label: "granchild 1", title: "node 4 tootip text", level: 3},
        // { id: 5, label: "Node 5", title: "node 5 tootip text" }
      ],
      edges: [
        { from: "parent 1", to: 3 },
        { from: "parent 1", to: "child 2" },
        { from: 2, to: "child 2" },
        { from: 2, to: 3 },
        { from: 6, to: 5 },
        { from: 5, to: 7 },
        { from: 3, to: 7 },
        // { from: 2, to: 5 }
      ]
    };
  
    const options = {
      layout: {
        hierarchical: true
      },
      edges: {
        color: "#000000"
      },
      height: "500px"
    };
  
 
    const events = {
      select: function(event) {
        var { nodes, edges } = event;
        console.log(nodes[0])   
        console.log(edges)
setSelectedNode(nodes[0])
      }
    };


  return (
    <main>
      { Auth.loggedIn() ? (<>
      < SinglePersonInfo current={selectedNode}/>
        
        <Graph
      key={graphKey}
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
