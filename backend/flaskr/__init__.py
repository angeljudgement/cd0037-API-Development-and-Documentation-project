import os
from flask import Flask, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
import json
from flask_cors import CORS
import random

from models import db, setup_db, Question, Category
from .auth import requires_auth

QUESTIONS_PER_PAGE = 10

def paginate_questions(request, selection):
    page = request.args.get("page", 1, type=int)
    start = (page - 1) * QUESTIONS_PER_PAGE
    end = start + QUESTIONS_PER_PAGE

    questions = [question.format() for question in selection]
    current_questions = questions[start:end]

    return current_questions


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    setup_db(app)

    CORS(app, supports_credentials=True)

    # CORS Headers
    @app.after_request
    def after_request(response):
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization,true"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
        return response

    @app.route('/categories', methods=['GET'])
    def retrieve_categories(payload):
        try:
            queryCategory = Category.query.order_by(Category.id).all()   
        except Exception:
            abort(500)

        if queryCategory is None:
            abort(404)
            
        mapped_categories = {}
        for category in queryCategory:
            mapped_categories[category.id] = category.type

        return jsonify(
            {
                "success": True,
                "categories": mapped_categories,
            }
        )

    @app.route('/questions', methods=['GET'])
    def retrieve_questions(payload):
        categoryParams = request.args.get('category', type=int)
        if categoryParams is None:
            try:
                currentCategory = None
                questions = Question.query.all()
            except Exception as e:
                abort(500)
#                 return 'Error at query without category: '+e, 500
        else:
            try:
                questions = Question.query.filter_by(category=categoryParams).all()
                currentCategory = Category.query.get(categoryParams).type
            except Exception as e:
                abort(500)
            
        paginatedQuestions = paginate_questions(request, questions)
        
        queryCategory = Category.query.all()
        mapped_categories = {}
        for category in queryCategory:
            mapped_categories[category.id] = category.type
            
        if len(paginatedQuestions) == 0:
            abort(404)
        return jsonify(
            {
                "success": True,
                "categories": mapped_categories,
                "current_category": currentCategory,
                "questions": paginatedQuestions,
                "total_questions": len(paginatedQuestions),
            }
        )
    
    @app.route('/question/<int:question_id>', methods=['GET'])
    @requires_auth('get:quizzes')
    def retrieve_question_by_id(payload, question_id):
        question = Question.query.get(question_id)

        if question is None:
            abort(404)

        return jsonify(
            {
                "success": True,
                "question": question.format()
            }
        )
        
    @app.route('/questions/<int:question_id>', methods=['DELETE'])
    @requires_auth('delete:quizzes')
    def delete_question(payload, question_id):
        try:
            questionToDelete = Question.query.get(question_id)
        except Exception as e:
            return 'Error at retrieve question to delete: '+e, 500
        if questionToDelete is not None:
            db.session.delete(questionToDelete)
            db.session.commit()
            return jsonify({
                'success': True,
                'question_id': questionToDelete.id
            })
        else:
            db.session.rollback()
            abort(404)

    @app.route('/questions', methods=['POST'])
    @requires_auth('post:quizzes')
    def create_question(payload):
        body = request.get_json()
        if (body == None
            or 'question' not in body or body['question'] == ''
            or 'answer' not in body or body['answer'] == ''
            or 'category' not in body or body['category'] == ''
            or 'difficulty' not in body or body['difficulty'] == ''
           ):
            abort(400)
        try:
            question = Question(question=body['question'], 
                                answer=body['answer'],
                                category=body['category'],
                                difficulty=body['difficulty']
                               )
            db.session.add(question)
            db.session.commit()
            return jsonify(
                {
                    "success": True,
                    "message": "Question added.",
                    "question_id": question.id,
                }
            )
        except Exception as e:
            db.session.rollback()
            abort(500)

    @app.route('/questions/<int:question_id>', methods=['PATCH'])
    @requires_auth('patch:quizzes')
    def update_question(payload, question_id):
        body = request.get_json()
        if id is None:
            abort(404)

        if (body == None
            or 'question' not in body or body['question'] == ''
            or 'answer' not in body or body['answer'] == ''
            or 'category' not in body or body['category'] == ''
            or 'difficulty' not in body or body['difficulty'] == ''):
            abort(400)

        try:
            question = Question.query.get(question_id)
            if question is None:
                abort(404)

            question.question = body['question'], 
            question.answer = body['answer'],
            question.category = body['category'],
            question.difficulty = body['difficulty']

            db.session.commit()
            return jsonify(
                {
                    "success": True,
                    "message": "Question updated.",
                    "question": body,
                }
            )
        except Exception as e:
            db.session.rollback()
            # abort(500)
            print(e)

    @app.route('/questions/search', methods=["POST"])
    def search_questions(payload):
        body = request.get_json()
        if (body == None or 'searchTerm' not in body or body['searchTerm'] == ''):
            try:
                questions = Question.query.all()
            except Exeption as e:
                abort(500)
        else:
            try:
                terms = '%{}%'.format(body['searchTerm'])
                questions = Question.query.filter(Question.question.ilike(terms)).all()
            except Exception as e:
                abort(500)
            
        if len(questions) == 0:
            abort(404)
        
        formatted_questions = [question.format() for question in questions]
                    
        return jsonify({
            "success": True,
            "questions": formatted_questions,
            "total_questions": len(formatted_questions),
        })

    @app.route('/categories/<int:category_id>/questions', methods=['GET'])
    @requires_auth('get:quizzes')
    def retrieve_questions_by_category(payload, category_id):
        category = Category.query.get(category_id)
        if Category.query.get(category_id) is not None:
            questions = Question.query.filter_by(category=category_id).all()
            formatted_questions = [question.format() for question in questions]
            return jsonify({
                "success": True,
                "questions": formatted_questions,
                "total_questions": len(formatted_questions),
                "current_category": category.format(),
            })
        else:
            abort(404)

    @app.route('/quizzes', methods=['POST'])
    @requires_auth('get:quizzes')
    def retrieve_quizzes(payload):
        body = request.get_json()
        if (body == None
            or 'quiz_category' not in body
            or body['quiz_category'] == ''
            or 'previous_questions' not in body
            or body['previous_questions'] == ''):
            abort(400)
#                 return 'Missing / Invalid property', 400
        
        quiz_category = body['quiz_category']
        previous_questions = body['previous_questions']
        
        try:
            if(quiz_category==0):
                filteredQuestions = Question.query.filter(
                    ~Question.id.in_(previous_questions)).all()
            else:
                queriedQuestions = Question.query.filter_by(category=quiz_category)
                filteredQuestions = queriedQuestions.filter(
                    ~Question.id.in_(previous_questions)).all()
            if(len(filteredQuestions) < 1):
                question = None
            else:
                question = random.choice(filteredQuestions)
        except Exception as e:
            abort(500)
        
        if question == None:
            return jsonify({"success": True, "question": None})
        
        return jsonify({"success": True, "question": question.format()})

    @app.errorhandler(404)
    def not_found(error):
        return (
            jsonify({"success": False, "error": 404, "message": "resource not found"}),
            404,
        )

    @app.errorhandler(500)
    def internal_server(error):
        return (
            jsonify({"success": False, "error": 500, "message": "internal server"}),
            500,
        )

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"success": False, "error": 400, "message": "bad request"}), 400
    
    @app.errorhandler(422)
    def unprocessable(error):
        return (
            jsonify({"success": False, "error": 422, "message": "unprocessable"}),
            422,
        )
    @app.errorhandler(403)
    def forbidden(error):
        return (
            jsonify({"success": False, "error": 403, "message": "Forbidden"}),
            403,
        )

    @app.errorhandler(401)
    def unauthorized(error):
        return (
            jsonify({"success": False, "error": 401, "message": "Unauthorized"}),
            401,
        )


    return app

app = create_app()

if __name__ == '__main__':
    app.run()