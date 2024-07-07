import React, { Component } from "react";
import "../stylesheets/App.css";
import Question from "./Question";
import Search from "./Search";
import QuizzesApis from "../service/apis.service";
import ReactLoading from "react-loading";

class QuestionView extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      page: 1,
      totalQuestions: 0,
      categories: {},
      currentCategory: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getQuestions();
  }

  getQuestions = () => {
    this.setState({ isLoading: true });
    QuizzesApis.getQuestion(this.state.page).then((result) => {
      this.setState({
        questions: result.questions,
        totalQuestions: result.total_questions,
        categories: result.categories,
        currentCategory: result.current_category,
        isLoading: false,
      });
    });
  };

  selectPage(num) {
    this.setState({ page: num }, () => this.getQuestions());
  }

  createPagination() {
    let pageNumbers = [];
    let maxPage = Math.ceil(this.state.totalQuestions / 10);
    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`page-num ${i === this.state.page ? "active" : ""}`}
          onClick={() => {
            this.selectPage(i);
          }}
        >
          {i}
        </span>
      );
    }
    return pageNumbers;
  }

  getByCategory = (id) => {
    this.setState({ isLoading: true });
    QuizzesApis.getByCategory(id).then((result) => {
      this.setState({
        questions: result.questions,
        totalQuestions: result.total_questions,
        currentCategory: result.current_category,
        isLoading: false,
      });
      return;
    });
  };

  submitSearch = (searchTerm) => {
    this.setState({ isLoading: true });
    QuizzesApis.submitSearch(searchTerm).then((result) => {
      this.setState({
        questions: result.questions,
        totalQuestions: result.total_questions,
        currentCategory: result.current_category,
        isLoading: false,
      });
      return;
    });
  };

  questionAction = (id) => (action) => {
    if (action === "DELETE") {
      this.setState({ isLoading: true });
      if (window.confirm("are you sure you want to delete the question?")) {
        QuizzesApis.deleteQuestion(id).then((result) => {
          this.setState({ isLoading: false });
          this.getQuestions();
        });
      }
    }

    if (action === "EDIT") {
      document.location.href = `/edit/${id}`;
    }
  };

  render() {
    return this.state.isLoading ? (
      <ReactLoading
        type="spinningBubbles"
        style={{ fill: "red", height: "25%", width: "25%", margin: "auto" }}
      />
    ) : (
      <div className="question-view">
        <div className="categories-list">
          <h2
            onClick={() => {
              this.getQuestions();
            }}
          >
            Categories
          </h2>
          <ul>
            {Object.keys(this.state.categories).map((id) => (
              <li
                key={id}
                onClick={() => {
                  this.getByCategory(id);
                }}
              >
                {this.state.categories[id]}
                <img
                  className="category"
                  alt={`${this.state.categories[id].toLowerCase()}`}
                  src={`${this.state.categories[id].toLowerCase()}.svg`}
                />
              </li>
            ))}
          </ul>
          <Search submitSearch={this.submitSearch} />
        </div>
        <div className="questions-list">
          <h2>Questions</h2>
          {this.state.questions.map((q, ind) => (
            <Question
              key={q.id}
              question={q.question}
              answer={q.answer}
              category={this.state.categories[q.category]}
              difficulty={q.difficulty}
              questionAction={this.questionAction(q.id)}
            />
          ))}
          <div className="pagination-menu">{this.createPagination()}</div>
        </div>
      </div>
    );
  }
}

export default QuestionView;
