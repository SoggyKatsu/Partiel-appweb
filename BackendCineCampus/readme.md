# run this command to create a virtual environment
python -m venv .venv

# run this command to activate the virtual environment
# for windows
.\.venv\Scripts\activate.bat

# run this command to install the dependencies
pip install -r requirements.txt

# run this command to start the server
uvicorn main:app --reload

