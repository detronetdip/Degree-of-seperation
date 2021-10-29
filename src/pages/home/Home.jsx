import React, { useRef, useEffect, useState } from "react";
import curd from "../../curd/curd";
import Header from "../../components/header/Header";
import { ToastContainer, toast } from "react-toastify";
import "./home.css";
import "react-toastify/dist/ReactToastify.css";
export default function Home() {
  useEffect(() => {
    if (!curd.existsCollection("friends")) {
      const friends = curd.createCollection("friends");
      friends.insertData({ allPair: [] }, curd);
    }
  },[]);
  const ref = useRef(null);
  const add = (e) => {
    e.preventDefault();
    if (ref.current.value == "") {
      toast.error("Enter a name");
    } else {
      if (curd.readData("users", { name: ref.current.value }).length > 0) {
        toast.error("Name is already present");
      } else {
        try {
          let nm = ref.current.value;
          let col = curd.createCollection("users");
          col.insertData(
            {
              name: nm,
            },
            curd
          );
          ref.current.value = "";
          toast.success("Added", { autoClose: 1000 });
        } catch (e) {
          toast.error("Something went wrong");
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
            <h4>Add Person</h4>
            <input type="text" placeholder="Enter Name" ref={ref} />
            <button className="btn" onClick={add}>
              Add
            </button>
          </form>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}
