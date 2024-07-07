import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from flaskr import create_app
from models import setup_db, Question, Category, DB_NAME_TEST, DB_USER, DB_PASSWORD, INSTRUCTOR_TOKEN, STUDENT_TOKEN

class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.database_path ="postgres://{}:{}@{}/{}".format(DB_USER, DB_PASSWORD,'localhost:5432', DB_NAME_TEST)
        self.app = create_app()
        self.client = self.app.test_client
        self.instructor_token = 'bearer ' + INSTRUCTOR_TOKEN
        self.student_token = 'bearer ' + STUDENT_TOKEN
        setup_db(self.app, self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            # create all tables
            self.db.create_all()
        
        self.create_question = {
            "answer": "Apollo 13",
            "category": 5,
            "difficulty": 4,
            "question": "What movie earned Tom Hanks his third straight Oscar nomination, in 1996?"
        }

        self.update_question = {
            "question": "Is the earth flat?",
            "answer": "No",
            "category": 5,
            "difficulty": 4
        }
    
    def tearDown(self):
        """Executed after reach test"""
        pass

    """
    TODO
    Write at least one test for each test for successful operation and for expected errors.
    """
#         @app.route('/quizzes', methods=['POST'])
    def test_retrieve_quizzes(self):
        res = self.client().post(
            '/quizzes',
            json={
                "quiz_category": 1,
                "previous_questions": [1,2,3],
            },
            headers={"Authorization": self.student_token}
        )
        body = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertTrue(body["question"])
    def test_retrieve_quizzes_failure(self):
        res = self.client().post(
            '/quizzes',
            json={
                "quiz_category": '',
                "previous_questions": '',
            },
            headers={"Authorization": self.student_token}
        )
        body = res.get_json()
        self.assertEqual(res.status_code, 400)
        self.assertEqual(body["success"], False)
        self.assertEqual(body["message"], "bad request")
            
#         @app.route('/categories/<int:category_id>/questions', methods=['GET'])
    def test_retrieve_questions_by_category(self):
        res = self.client().get(
            '/categories/1/questions',
            headers={"Authorization": self.instructor_token}
        )
        body = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(body["success"], True)
        self.assertTrue(len(body["questions"]))
        self.assertTrue((body["total_questions"]))
        self.assertTrue((body["current_category"]))
    def test_retrieve_questions_by_category_failure(self):
        res = self.client().get(
            '/categories/1114/questions',
            headers={"Authorization": self.instructor_token}
        )
        body = res.get_json()
        
        self.assertEqual(res.status_code, 404)
        self.assertEqual(body["success"], False)
        self.assertEqual(body["message"], "resource not found")
            
#         @app.route('/questions/search', methods=["POST"])
    def test_search_questions(self):
        res = self.client().post('/questions/search', json={"searchTerm": "Tom Hanks"}, headers={"Authorization": self.student_token})
        body = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(body["success"], True)
        self.assertTrue(len(body["questions"]))
        self.assertTrue((body["total_questions"]))
    def test_search_questions_failure(self):
        res = self.client().post('/questions/search', json={"searchTerm": "asd"}, headers={"Authorization": self.student_token})
        body = res.get_json()
        self.assertEqual(res.status_code, 404)
        self.assertEqual(body["success"], False)
        self.assertEqual(body["message"], "resource not found")
        
#         @app.route('/questions', methods=['PATCH'])
    def test_update_question(self):
        res = self.client().patch(
            '/questions/4',
            json=self.update_question,
            headers={"Authorization": self.instructor_token}
        )
        body = res.get_json()
        print(body)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(body["success"], True)
        self.assertEqual(body["message"], "Question updated.")
        self.assertTrue(body["question"])
    def test_update_question_student(self):
        res = self.client().patch(
            '/questions/4',
            json=self.update_question,
            headers={"Authorization": self.student_token}
        )
        body = res.get_json()
        print(body)

        self.assertEqual(res.status_code, 403)
        self.assertEqual(body["success"], False)
    def test_update_question_failure(self):
        res = self.client().patch(
            '/questions/2',json={}, headers={"Authorization": self.instructor_token}
        )
        body = res.get_json()

        self.assertEqual(res.status_code, 400)
        self.assertEqual(body["success"], False)
        self.assertEqual(body["message"], "bad request")
        
#         @app.route('/questions/<int:question_id>', methods=['POST'])
    def test_create_question(self):
        res = self.client().post(
            '/questions',
            json=self.create_question,
            headers={"Authorization": self.instructor_token}
        )
        body = res.get_json()

        self.assertEqual(res.status_code, 200)
        self.assertEqual(body["success"], True)
        self.assertEqual(body["message"], "Question added.")
        self.assertTrue(body["question_id"])
    def test_create_question_failure(self):
        res = self.client().post(
            '/questions',json={}, headers={"Authorization": self.instructor_token}
        )
        body = res.get_json()

        self.assertEqual(res.status_code, 400)
        self.assertEqual(body["success"], False)
        self.assertEqual(body["message"], "bad request")
        
#         @app.route('/questions/<int:question_id>', methods=['DELETE'])
    def test_delete_question(self):
        res = self.client().delete("/questions/2", headers={"Authorization": self.instructor_token})
        body = res.get_json()
        question = Question.query.get(2)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(body["success"], True)
        self.assertEqual(body["question_id"], 2)
        self.assertEqual(question, None)
    def test_delete_question_failure(self):
        res = self.client().delete("/questions/123", headers={"Authorization": self.instructor_token})
        body = res.get_json()

        self.assertEqual(res.status_code, 404)
        self.assertEqual(body["success"], False)
        
#         @app.route('/questions', methods=['GET'])
    def test_retrieve_questions(self):
        res = self.client().get('/questions', headers={"Authorization": self.instructor_token})
        body = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertTrue(body["success"])
        self.assertTrue(int(len(body["questions"])>0))
    def test_retrieve_questions_by_category(self):
        res = self.client().get('/questions?category=1', headers={"Authorization": self.instructor_token})
        body = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertTrue(body["success"])
        self.assertTrue(int(len(body["questions"])>0))
        
#         @app.route('/categories', methods=['GET'])
    def test_retrieve_categories(self):
        res = self.client().get('/categories', headers={"Authorization": self.instructor_token})
        body = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertTrue(body["success"])
        self.assertTrue(int(len(body["categories"]))>0)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()