import React, { Component, Fragment } from "react";
import Swal from "sweetalert2";
import "./Test.css";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = { title: "", questions: [], checkingAnswers: false };
  }
  componentDidMount() {
    this.setState({
      title: this.props.questions.title,
      questions: (() => {
        const inputs = [];
        for (
          let index = 0;
          index < this.props.questions.questions.length;
          index++
        ) {
          inputs.push({
            title: this.props.questions.questions[index].title,
            value: "",
            answer: this.props.questions.questions[index].answer,
          });
        }
        return inputs;
      })(),
    });
  }
  render() {
    const onChangeHandler = (event, index) => {
      const value = event.target.value;
      console.log(value);
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.questions[index].value = value;
        return { newState };
      });
    };
    const onSubmitHandler = () => {
      Swal.fire({
        title: "Jesteś pewny?",
        text: "Nie będziesz w stanie cofnąć tej akcji",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Tak, sprawdź odpowiedzi!",
        cancelButtonText: "Nie, kontynuuj test",
      }).then((result) => {
        if (result.value) {
          this.setState({ checkingAnswers: true });
        }
      });
    };
    const list = this.state.questions.map((el, index) => {
      let classname = "";
      let value = el.value;
      if (this.state.checkingAnswers) {
        if (value.toLowerCase().trim() === el.answer.toLowerCase().trim()) {
          classname = "success";
        } else {
          classname = "fail";
        }
      }
      return (
        <div className="Question" key={index}>
          <label>{el.title}</label>
          <input
            type="text"
            onChange={(event) => onChangeHandler(event, index)}
            className={classname}
            value={value}
            disabled={this.state.checkingAnswers}
          />
        </div>
      );
    });
    return (
      <div className="Test">
        {list}
        <button
          className="authSubmit"
          style={{
            display: this.state.checkingAnswers ? "none" : "inline-block",
          }}
          onClick={onSubmitHandler}
        >
          Sprawdź odpowiedzi
        </button>
      </div>
    );
  }
}

export default Test;
