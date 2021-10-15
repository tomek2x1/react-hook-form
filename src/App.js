import { useEffect } from "react";
import "./App.css";
import Form from "./Components/Form";
import Spinner from "./Components/Spinner";
import MsgSuccess from "./Components/MsgSuccess";
import MsgError from "./Components/MsgError";

const App = () => {
  return (
    <div className="App">
      <Form />
      <Spinner />
      <MsgSuccess />
      <MsgError />
    </div>
  );
};

export default App;
