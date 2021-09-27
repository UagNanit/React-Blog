import "./styles.css";
import ScrollBoxForList from "./components/ScrollBoxForList";
import ArticleItem from "./components/ArticleItem";
import AddEditForm from "./components/AddEditForm";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { useState } from "react";
import { UserContext } from "./components/context";
import Login from "./components/Login";

export default function App(props) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider
      value={{
        userCon: user,
        setUserCon: (val) => setUser(val)
      }}
    >
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/">
              <ScrollBoxForList />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route
              exact
              path="/article/:id"
              render={(props) => <ArticleItem {...props} />}
            />
            <Route
              exact
              path="/addEditForm/:id"
              render={(props) => <AddEditForm {...props} />}
            />
            <Route children={() => <h1>404 page</h1>} />
          </Switch>
        </Router>
      </div>
    </UserContext.Provider>
  );
}
