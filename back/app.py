from flask import Flask, request
app = Flask(__name__)


@app.route('/', methods=['GET'])
def hello_world():
    return 'Hi!'


@app.route('/', methods=['POST'])
def upload_file():
    response = 'No file uploaded'
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        response = uploaded_file.filename + '\n'
    return response