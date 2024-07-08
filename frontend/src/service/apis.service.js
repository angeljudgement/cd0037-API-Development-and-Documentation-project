import AuthService from "./auth.service";
import { environment } from "../env";
import $ from "jquery";

class QuizzesApisService {
  url = environment.apiServerUrl;

  items = {};

  getHeaders() {
    return `bearer ${AuthService.activeJWT()}`;
  }

  createRequestHeader = () => {
    const bearer = this.getHeaders();
    return {
      dataType: "json",
      contentType: "application/json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", bearer);
      },
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
    };
  };

  createQuestion = (question) => {
    return $.ajax({
      ...this.createRequestHeader(),
      url: this.url + "/questions", //TODO: update request URL
      type: "POST",
      data: JSON.stringify({
        question: question.question,
        answer: question.answer,
        difficulty: question.difficulty,
        category: question.category,
      }),
      success: (result) => {
        return result;
      },
      error: (error) => {
        alert("Unable to add question. Please try your request again");
        if (error.statusCode().status === 401) {
          document.location.href = "/";
        } else {
          document.location.href = "/";
        }
        return;
      },
    });
  };

  updateQuestion = (question) => {
    return $.ajax({
      ...this.createRequestHeader(),
      url: this.url + `/questions/${this.id}`, //TODO: update request URL
      type: "PATCH",
      data: JSON.stringify({
        question: question.question,
        answer: question.answer,
        difficulty: parseInt(question.difficulty),
        category: question.category,
      }),
      success: (result) => {
        return result;
      },
      error: (error) => {
        if (error.statusCode().status === 401) {
          document.location.href = "/";
        } else {
          alert("Unable to add question. Please try your request again");
          document.location.href = "/";
        }
        return;
      },
    });
  };

  getQuestion = (page) => {
    return $.ajax({
      ...this.createRequestHeader(),
      url: this.url + `/questions?page=${page}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        return result;
      },
      error: (error) => {
        if (error.statusCode().status === 401) {
          document.location.href = "/";
        } else {
          alert("Unable to load questions. Please try your request again");
          document.location.href = "/";
        }
        return;
      },
    });
  };

  getQuestionById = (page) => {
    return $.ajax({
      ...this.createRequestHeader(),
      url: this.url + `/question/${this.id}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        return result;
      },
      error: (error) => {
        if (error.statusCode().status === 401) {
          document.location.href = "/";
        } else {
          alert("Unable to load questions. Please try your request again");
          document.location.href = "/";
        }
        return;
      },
    });
  };

  getByCategory = (id) => {
    return $.ajax({
      ...this.createRequestHeader(),
      url: this.url + `/categories/${id}/questions`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        return result;
      },
      error: (error) => {
        alert("Unable to load questions. Please try your request again");
        if (error.statusCode().status === 401) {
          document.location.href = "/";
        } else {
          document.location.href = "/";
        }
        return;
      },
    });
  };

  getCategory = () => {
    return $.ajax({
      ...this.createRequestHeader(),
      url: this.url + `/categories`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        return result;
      },
      error: (error) => {
        if (error.statusCode().status === 401) {
          document.location.href = "/";
        } else {
          alert("Unable to load categories. Please try your request again");
          document.location.href = "/";
        }
        return;
      },
    });
  };

  submitSearch = (searchTerm) => {
    return $.ajax({
      ...this.createRequestHeader(),
      url: this.url + `/questions/search`, //TODO: update request URL
      type: "POST",
      data: JSON.stringify({ searchTerm: searchTerm }),
      success: (result) => {
        return result;
      },
      error: (error) => {
        if (error.statusCode().status === 401) {
          document.location.href = "/";
        } else {
          alert("Unable to load questions. Please try your request again");
          document.location.href = "/";
        }
        return;
      },
    });
  };

  deleteQuestion = (id) => {
    return $.ajax({
      ...this.createRequestHeader(),
      url: this.url + `/questions/${id}`, //TODO: update request URL
      type: "DELETE",
      success: (result) => {
        return result;
      },
      error: (error) => {
        if (error.statusCode().status === 401) {
          document.location.href = "/]";
        } else {
          alert("Unable to load questions. Please try your request again");
          document.location.href = "/";
        }
        return;
      },
    });
  };

  getQuizzes = (previousQuestions, quizCategoryId) => {
    return $.ajax({
      ...this.createRequestHeader(),
      url: this.url + "/quizzes", //TODO: update request URL
      type: "POST",
      data: JSON.stringify({
        previous_questions: previousQuestions,
        quiz_category: parseInt(quizCategoryId),
      }),
      success: (result) => {
        return result;
      },
      error: (error) => {
        alert("Unable to load question. Please try your request again");
        if (error.statusCode().status === 401) {
          document.location.href = "/";
        } else {
          document.location.href = "/";
        }
        return;
      },
    });
  };
}

const QuizzesApis = new QuizzesApisService();

export default QuizzesApis;
