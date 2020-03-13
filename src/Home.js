import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { Transition, TransitionGroup } from "react-transition-group";
import "@reach/dialog/styles.css";
import store from "store";
import Create from "./components/Create";
import Show from "./components/Show";
import Edit from "./components/Edit";
import List from "./components/List";
import isLoggedIn from "./helpers/isLoggedIn";
import ShowProfile from "./components/ShowProfile";
import EditProfile from "./components/EditProfile";
import HomeList from "./components/HomeList";
import HomeListByTag from "./components/HomeListByTag";
import Search from "./components/Search";
import FourOhFour from "./components/FourOhFour";
import { faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookie from "js-cookie";
import jwt from "jsonwebtoken";
import { play, exit } from "./timelines";

const handleLogout = history => () => {
  Cookie.remove("token");
  store.remove("loggedIn");
  console.log("you have been logged out. boo!");
  history.push("/login");
};

const Home = ({ history }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userid = jwt.decode(Cookie.get("token"));
    if (userid) {
      setUser(userid.username);
    }
  }, []);

  if (!isLoggedIn()) {
    return <Redirect to="/login" />;
  } else {
    return (
      <div>
        <nav
          className="navbar navbar-expand-lg navbar-light"
          style={{ backgroundColor: "#e6e6e6" }}
        >
          <Link to={"/"} className="navbar-brand" data-testid="blog">
            My Blog
          </Link>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/create"} className="nav-link" data-testid="create">
                  Create
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/list"} className="nav-link" data-testid="list">
                  List
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/search"} className="nav-link" data-testid="search">
                  <FontAwesomeIcon icon={faSearch} />
                </Link>
              </li>
            </ul>
          </div>
          <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link" data-testid="user">
                  <FontAwesomeIcon icon={faUserCircle} />
                  {" " + user}
                </Link>
              </li>
              <li className="nav-item">
                <button
                  onClick={handleLogout(history)}
                  className="btn btn-secondary"
                  data-testid="logout"
                >
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </nav>{" "}
        <br />
        <br />
        <Route
          render={({ location }) => {
            const { pathname, key } = location;
            return (
              <TransitionGroup component={null}>
                <Transition
                  key={key}
                  appear={true}
                  onEnter={(node, appears) => play(pathname, node, appears)}
                  onExit={(node, appears) => exit(node, appears)}
                  timeout={{ enter: 750, exit: 150 }}
                >
                  <Switch location={location}>
                    <Route exact={true} path="/" component={HomeList} />
                    <Route path="/search" component={Search} />
                    <Route exact={true} path="/create" component={Create} />
                    <Route path="/show/:id" component={Show} />
                    <Route path="/edit/:id" component={Edit} />
                    <Route path="/list" component={List} />
                    <Route
                      exact={true}
                      path="/profile"
                      component={ShowProfile}
                    />
                    <Route
                      exact={true}
                      path="/profile/:username"
                      component={ShowProfile}
                    />
                    <Route
                      path="/tag/:name"
                      render={props => <HomeListByTag {...props} />}
                    />
                    <Route
                      path="/editprofile"
                      render={props => (
                        <EditProfile {...props} setUser={setUser} />
                      )}
                    />
                    <Route component={FourOhFour} />
                  </Switch>
                </Transition>
              </TransitionGroup>
            );
          }}
        />
      </div>
    );
  }
};

export default Home;
