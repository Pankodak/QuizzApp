import React, { Component, Fragment } from "react";
import { ipcRenderer } from "electron";
import "./Categories.css";
import Test from "../Test/Test";

function isEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = { test: false, questions: [] };
  }
  componentDidMount() {
    if (this.state.questions.length === 0) {
      ipcRenderer.on("repQuestions", (event, arg) => {
        this.setState((prevState) => ({
          ...prevState,
          questions: JSON.parse(arg),
        }));
      });
      ipcRenderer.send("getQuestions", this.props.cat);
    }
  }
  componentWillUnmount() {
    ipcRenderer.removeAllListeners("repQuestions");
  }

  render() {
    let questions = this.state.test ? (
      <Test questions={this.state.test} />
    ) : null;
    const onClickHandler = (index) => {
      this.setState((prevState) => ({
        ...prevState,
        test: prevState.questions[index],
      }));
    };
    let items = (
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
    if (this.state.questions.length !== 0) {
      items = this.state.questions.map((el, index) => (
        <div
          key={index}
          className="element"
          onClick={() => onClickHandler(index)}
        >
          {el.title}
        </div>
      ));
    }
    return (
      <Fragment>
        {questions}
        <div className="Categories">
          {items ? items : <div>Loading...</div>}
        </div>
      </Fragment>
    );
  }
}

export default Categories;
