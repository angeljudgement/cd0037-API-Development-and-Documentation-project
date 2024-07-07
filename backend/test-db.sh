dropdb -U postgres trivia_test
createdb -U postgres trivia_test
psql -U postgres trivia_test < trivia.psql

python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
python test_flaskr.py