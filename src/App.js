import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import View from "./pages/view/View";
import Relation from "./pages/relation/Relation";

export default function App() { 
  return (
    <>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/view" exact>
            <View />
          </Route>
          <Route path="/connect" exact>
            <Relation />
          </Route>
        </Switch>
    </>
  );
}