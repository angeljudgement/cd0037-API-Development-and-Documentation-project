import React, { Component } from "react";
import "../stylesheets/Question.css";
import { permission } from "../service/permission";
import AuthService from "../service/auth.service";

class Question extends Component {
  constructor() {
    super();
    this.state = {
      visibleAnswer: false,
    };
    this.decode = AuthService.activeJWT()
      ? AuthService.decodeJWT(AuthService.activeJWT())
      : { permissions: [] };
  }

  flipVisibility() {
    this.setState({ visibleAnswer: !this.state.visibleAnswer });
  }

  render() {
    const { question, answer, category, difficulty } = this.props;
    return (
      <div className="Question-holder">
        <div className="Question">{question}</div>
        <div className="Question-status">
          <img
            className="category"
            alt={`${category.toLowerCase()}`}
            src={`${category.toLowerCase()}.svg`}
          />
          <div className="difficulty">Difficulty: {difficulty}</div>
          {this.decode.permissions.includes(permission.patch) && (
            <img
              src="pencil.svg"
              alt="edit"
              className="delete"
              onClick={() => this.props.questionAction("EDIT")}
            />
          )}
          {this.decode.permissions.includes(permission.delete) && (
            <img
              src="delete.png"
              alt="delete"
              className="delete"
              onClick={() => this.props.questionAction("DELETE")}
            />
          )}
        </div>
        {this.decode.permissions.includes(permission.patch) && (
          <>
            <div
              className="show-answer button"
              onClick={() => this.flipVisibility()}
            >
              {this.state.visibleAnswer ? "Hide" : "Show"} Answer
            </div>
            <div className="answer-holder">
              <span
                style={{
                  visibility: this.state.visibleAnswer ? "visible" : "hidden",
                }}
              >
                Answer: {answer}
              </span>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Question;
