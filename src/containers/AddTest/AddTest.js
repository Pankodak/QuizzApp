import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import Swal from "sweetalert2";
import { ipcRenderer } from "electron";
import "./AddTest.css";
class AddTest extends Component {
  constructor(props) {
    super(props);
    this.state = { title: "", system: "", questions: [] };
  }

  render() {
    const auth = localStorage.getItem("Auth") == 1;
    let form = null;
    if (!auth) {
      form = <Redirect to="/" />;
    }
    const addInputQuestionHandler = () => {
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.questions.push({ title: "", answer: "" });
        return newState;
      });
    };
    const onTitleQuestChangeHandler = (event, index) => {
      const value = event.target.value;
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.questions[index].title = value;
        return newState;
      });
    };
    const onValueQuestChangeHandler = (event, index) => {
      const value = event.target.value;
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.questions[index].answer = value;
        return newState;
      });
    };
    const onTitleChangeHandler = (event) => {
      const value = event.target.value;
      this.setState({ title: value });
    };
    const onRemoveQuestionHandler = (index) => {
      Swal.fire({
        title: "Jesteś pewny?",
        text: "Nie będziesz w stanie cofnąć tej akcji",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Tak, usuń!",
        cancelButtonText: "Nie, zostaw!",
      }).then((result) => {
        if (result.value) {
          this.setState((prevState) => {
            let state = { ...prevState };
            state.questions = state.questions.filter((el, i) => index !== i);
            return state;
          });
          Swal.fire("Usunięto", "Pomyślnie usunięto pytanie", "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Przerwano", "Akcja przerwana", "success");
        }
      });
    };
    const onSystemChangeHandler = (event) => {
      const value = event.target.value;
      this.setState({ system: value });
    };
    const onSubmitTestHandler = () => {
      if (this.state.questions.length === 0) {
        Swal.fire("Oops...", "Nie możesz zrobić testu bez pytań", "error");
        return;
      }
      if (this.state.title.trim() == "" || this.state.system.trim() == "") {
        Swal.fire("Oops...", "Twoje pola nie mogą być puste", "error");
        return;
      }
      for (let i = 0; i < this.state.questions.length; i++) {
        if (
          this.state.questions[i].title.trim() == "" ||
          this.state.questions[i].answer.trim() == ""
        ) {
          Swal.fire("Oops...", "Twoje pola nie mogą być puste", "error");
          return;
        }
      }
      Swal.fire({
        title: "Jesteś pewny?",
        text: "Nie będziesz w stanie cofnąć tej akcji",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Tak, zatwierdź test",
        cancelButtonText: "Nie, kontynuuj pisanie testu",
      }).then((result) => {
        if (result.value) {
          this.setState({ checkingAnswers: true });
          let index = null;
          if (this.state.system.toLowerCase() == "windows") {
            index = 0;
          } else if (this.state.system.toLowerCase() == "linux") {
            index = 1;
          } else {
            Swal.fire("Oops...", "Wpisałeś złą nazwę kategorii", "error");
            return;
          }
          ipcRenderer.send("addQuestion", {
            title: this.state.title,
            system: index,
            questions: this.state.questions,
          });
          this.props.history.push("/");
          Swal.fire("✔️", "Pomyślnie dodano test", "success");
        }
      });
    };
    let list = this.state.questions.map((el, index) => {
      return (
        <div className="Question" key={index}>
          <label>Nazwa pytania</label>
          <input
            type="text"
            onChange={(event) => onTitleQuestChangeHandler(event, index)}
            value={el.title}
          />
          <label>Odpowiedź</label>
          <input
            type="text"
            onChange={(event) => onValueQuestChangeHandler(event, index)}
            value={el.answer}
          />
          <button
            style={{ margin: "3px auto" }}
            className="authSubmit"
            onClick={() => onRemoveQuestionHandler(index)}
          >
            Usuń pytanie
          </button>
        </div>
      );
    });
    return (
      <div className="Test">
        {form}
        <div className="Question">
          <label style={{ textTransform: "uppercase" }}>Nazwa testu</label>
          <input
            type="text"
            onChange={(event) => onTitleChangeHandler(event)}
            value={this.state.title}
          />
          <label style={{ textTransform: "uppercase" }}>Kategoria</label>
          <input
            type="text"
            value={this.state.system}
            onChange={(event) => onSystemChangeHandler(event)}
            placeholder="windows/linux"
          />
        </div>
        <br />
        {list}
        <button className="authSubmit" onClick={addInputQuestionHandler}>
          Dodaj pytanie
        </button>
        <br />
        <button className="authSubmit" onClick={onSubmitTestHandler}>
          Zatwierdź test
        </button>
      </div>
    );
  }
}

export default withRouter(AddTest);
