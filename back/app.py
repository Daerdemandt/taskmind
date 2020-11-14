from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_pymongo import PyMongo
from db.db import Tree
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

mongo = PyMongo(app, uri=os.environ.get('MONGO_URI'))


def get_mongo() -> PyMongo:
    return mongo.db


@app.route("/sockchat/")
def sockchat():
    return render_template("index.html")


@socketio.on('save')
def save(data: dict):
    tree = Tree(get_mongo())
    tree_nodes = tree.save_tree(data["project"], data["tree"])
    socketio.emit('saved', {'message': tree_nodes})


@socketio.on('get')
def save(data: dict):
    tree = Tree(get_mongo())
    socketio.emit('tree', str(tree.get_tree(data["project"])))


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
