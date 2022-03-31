import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { ipcRenderer } from "electron";
import Swal from "sweetalert2";
import "./RemoveTest.css";
class RemoveTest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    ipcRenderer.on("repQuestionsAll", (event, arg) => {
      const state = JSON.parse(arg);
      this.setState({
        ...state,
      });
    });
    ipcRenderer.send("getQuestions", "all");
  }
  componentWillUnmount() {
    ipcRenderer.removeAllListeners("repQuestionsAll");
  }

  render() {
    const onRemoveHandler = (system, index) => {
      Swal.fire({
        title: "Jesteś pewny?",
        text: "Nie będziesz w stanie cofnąć tej akcji",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Tak, usuń!",
        cancelButtonText: "Nie, zostaw!",
      }).then((result) => {
        if (result.value) {
          Swal.fire("Usunięto", "Pomyślnie usunięto test", "success");
          ipcRenderer.send("removeQuestion", { system, index });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Przerwano", "Akcja przerwana", "success");
        }
      });
    };
    const auth = localStorage.getItem("Auth") == 1;
    let form = null;
    if (!auth) {
      form = <Redirect to="/" />;
    }
    let listWin,
      listLin,
      all = null;
    if (Object.keys(this.state).length !== 0) {
      listWin = this.state[0].map((el, index) => (
        <div
          className="element auth"
          key={"0" + index}
          onClick={() => onRemoveHandler(0, index)}
        >
          {el.title}(Windows)
        </div>
      ));
      listLin = this.state[1].map((el, index) => (
        <div
          className="element auth"
          key={"1" + index}
          onClick={() => onRemoveHandler(1, index)}
        >
          {el.title}(Linux)
        </div>
      ));
      all = listWin.concat(listLin);
      if (all.length === 0) {
        all = (
          <p
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Brak testów.
          </p>
        );
      }
    }
    return (
      <div className="Categories">
        {form}
        {all}
      </div>
    );
  }
}

export default RemoveTest;
