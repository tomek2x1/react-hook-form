import { useState } from "react";
import "./App.css";
import Form from "./Components/Form";
import Spinner from "./Components/Spinner";
import MsgSuccess from "./Components/MsgSuccess";
import MsgError from "./Components/MsgError";

const App = () => {
  const [showForm, setShowForm] = useState(true);

  const [showSpinner, setShowSpinner] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [showError, setShowError] = useState(false);

  const [taskNumber, setTaskNumber] = useState("");

  return (
    <div className="App">
      {showForm ? (
        <Form
          setShowForm={setShowForm}
          setShowSpinner={setShowSpinner}
          setShowSuccess={setShowSuccess}
          setShowError={setShowError}
          setTaskNumber={setTaskNumber}
        />
      ) : null}
      {showSpinner ? <Spinner /> : null}
      {showSuccess ? <MsgSuccess taskNumber={taskNumber} /> : null}
      {showError ? <MsgError /> : null}
    </div>
  );
};

export default App;
