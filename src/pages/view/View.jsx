import React, { useRef, useEffect, useState } from "react";
import { createGraph, relation, view } from "../../utility/utility";
import Header from "../../components/header/Header";
import curd from "../../curd/curd";
import "./view.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function View() {
  const [state, setstate] = useState(null);
  const [rel, setRel] = useState(null);
  const ref = useRef(null);
  const ref2 = useRef(null);
  const fetch = () => {
    let user = curd.readData("users");
    let keys = curd.getKeys(user);
    let names = [];
    for (let i = 0; i < keys.length; i++) {
      names.push(user[keys[i]].name);
    }
    setstate(names);
  };
  function create() {
    try {
      const data = curd.readData("users");
      createGraph(data.count);
      const v = curd.readData("friends");
      const af = v[0].allPair;
      for (let i = 0; i < af.length; i++) {
        relation(af[i][0], af[i][1]);
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  }
  useEffect(() => {
    create();
    fetch();
  }, []);
  function view_r(e) {
    e.preventDefault();
    const user1 = ref.current.value;
    const user2 = ref2.current.value;
    if (user1 == "" || user2 == "") {
      toast.error("Select 2 name first");
    } else {
      if (user1 === user2) {
        toast.error("Same person cannot be a friend");
      } else {
        const id1 = curd.Id("users", { name: user1 });
        const id2 = curd.Id("users", { name: user2 });
        const st = view(id1, id2);
        let rNames = [];
        st.forEach((e) => {
          let temp = [];
          e.forEach((f) => {
            temp.push(curd.readData("users", f).name);
          });
          rNames.push(temp);
          temp = [];
        });
        setRel(rNames);
      }
    }
  }
  return (
    <>
      <Header />
      <section className="view">
        <div className="formrow">
          <div className="formcontainer">
            <form action="">
              <h4>View Relation</h4>
              <select type="text" placeholder="Enter Name" ref={ref}>
                <option value="">Select first Person</option>
                {state?.map((e) => (
                  <Option value={e} />
                ))}
              </select>
              <select type="text" placeholder="Enter Name" ref={ref2}>
                <option value="">Select second Person</option>
                {state?.map((e) => (
                  <Option value={e} />
                ))}
              </select>
              <button
                className="btn"
                style={{ marginTop: "2rem" }}
                onClick={view_r}
              >
                View
              </button>
            </form>
          </div>
        </div>
        <div className="relationview">
          {rel?.map((e) => (
            <Box sr={e} />
          ))}
        </div>
      </section>
      <ToastContainer />
    </>
  );
}
const Box = (props) => {
  return (
    <>
      <div style={{ color: "white" }} className="viewBx">
        {props.sr.map((e, i, { length }) => (
          <Singlenode name={e} index={i} length={length} />
        ))}
      </div>
    </>
  );
};
const Singlenode = (props) => {
  return (
    <>
      <span className="indi">{props.index == 0 ? "" : ">>"}</span>
      <div style={{ color: "white" }} className="singlenode">
        {props.name}
      </div>
    </>
  );
};
const Option = (props) => {
  return (
    <>
      <option value={props.value}>{props.value}</option>
    </>
  );
};
