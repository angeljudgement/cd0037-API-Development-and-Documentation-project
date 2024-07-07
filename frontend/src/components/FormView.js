import React, { Component } from "react";
import "../stylesheets/FormView.css";
import QuizzesApis from "../service/apis.service";
import AuthService from "../service/auth.service";
import ReactLoading from "react-loading";

class FormView extends Component {
  id;

  constructor(props) {
    super();
    this.state = {
      question: "",
      answer: "",
      difficulty: 1,
      category: 1,
      categories: {},
      isLoading: true,
    };
    this.id = props.match.params.id;
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    QuizzesApis.getCategory().then((result) => {
      this.setState({ categories: result.categories, isLoading: false });
      return;
    });

    if (this.id) {
      this.setState({ isLoading: true });
      AuthService.getQuestionById(this.id).then((result) => {
        this.setState({
          question: result.question.question,
          answer: result.question.answer,
          difficulty: result.question.difficulty,
          categories: this.state.categories,
          isLoading: false,
        });

        return;
      });
    }
  }

  submitQuestion = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    if (this.id) {
      QuizzesApis.updateQuestion(this.state).then(() => {
        this.setState({ isLoading: false });
        document.location.href = "/";
      });
    } else {
      QuizzesApis.createQuestion(this.state).then(() => {
        this.setState({ isLoading: false });
        document.getElementById("add-question-form").reset();
      });
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return this.state.isLoading ? (
      <ReactLoading
        type="spinningBubbles"
        style={{ fill: "red", height: "25%", width: "25%", margin: "auto" }}
      />
    ) : (
      <div id="add-form">
        <h2>Add a New Trivia Question</h2>
        <form
          className="form-view"
          id="add-question-form"
          onSubmit={this.submitQuestion}
        >
          <label>
            Question
            <input
              type="text"
              name="question"
              value={this.state.question}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Answer
            <input
              type="text"
              name="answer"
              value={this.state.answer}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Difficulty
            <select
              name="difficulty"
              value={this.state.difficulty}
              onChange={this.handleChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
          <label>
            Category
            <select name="category" onChange={this.handleChange}>
              {Object.keys(this.state.categories).map((id) => {
                return (
                  <option key={id} value={id}>
                    {this.state.categories[id]}
                  </option>
                );
              })}
            </select>
          </label>
          <input type="submit" className="button" value="Submit" />
        </form>
      </div>
    );
  }
}

export default FormView;
