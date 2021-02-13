import logo from "./logo.svg";
import "./App.css";
import Layout from "./Layout/Layout";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import SigninComponent from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import PostDetails from "./pages/PostDetails";
import SingleBlog from "./pages/SingleBlog";
import CategoryHome from "./pages/CategoryHome";

const production = false;

export const API = production
  ? process.env.REACT_APP_PRODUCTION_API
  : process.env.REACT_APP_DEVELOPMENT_API;

export const APP_NAME = process.env.REACT_APP_APP_NAME;

console.log(API);
console.log(process.env.REACT_APP_DOMAIN);

console.log(API);

export const DOMAIN = production
  ? process.env.REACT_APP_DOMAIN_API
  : process.env.REACT_APP_DEVELOPMENT_API;

function App() {
  return (
    <Layout>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/davai" exact component={SigninComponent} />
          <Route path="/myDashboard" exact component={Dashboard} />
          <Route path="/myDashboard/post/:id" exact component={PostDetails} />
          <Route path="/blog/:id" exact component={SingleBlog} />
          <Route path="/categories/:id" exact component={CategoryHome} />
        </Switch>
      </div>
    </Layout>
  );
}

export default App;
