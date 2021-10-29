import React, { useRef, useEffect, useState } from "react";
import curd from "../../curd/curd";
import Header from "../../components/header/Header";
import { ToastContainer, toast } from "react-toastify";
import "./relation.css";
import "react-toastify/dist/ReactToastify.css";
export default function Relation() {
  const [state, setstate] = useState(null);
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
  useEffect(() => {
    fetch();
  }, []);
  const addRelation = (e) => {
    e.preventDefault();
    const user1 = ref.current.value;
    const user2 = ref2.current.value;
    if(user1=='' || user2==""){
      toast.error("Choose friends first");
    }else{
      if (user1 === user2) {
        toast.error("Same person cannot be a friend");
      } else {
        const id1 = curd.Id("users", { name: user1 });
        const id2 = curd.Id("users", { name: user2 });
        const pair = [id1, id2];
        const pair2 = [id2, id1];
        if (curd.existsCollection("friends")) {
          const all = curd.readData("friends")[0].allPair;
          let count = 0;
          for (let i = 0; i < all.length; i++) {
            const c = all[i];
            if (
              (c[0] == pair[0] && c[1] == pair[1]) ||
              (c[1] == pair[0] && c[0] == pair[1])
            ) {
              count++;
            }
          }
          if (count > 0) {
            toast.error("Already Friend");
          } else {
            all.push(pair);
            all.push(pair2);
            curd.updateData("friends", 0, { allPair: all });
            ref.current.value=''
            ref2.current.value=''
            toast.success("connected",{ autoClose: 1000 });
          }
        }
      }
    }
  };
  return (
    <>
      <Header />
      <section className="home">
        <div className="formcontainer">
          <form action="">
            <h4>Connect Persons</h4>
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
              onClick={addRelation}
            >
              Connect
            </button>
          </form>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}
const Option = (props) => {
  return (
    <>
      <option value={props.value}>{props.value}</option>
    </>
  );
};
