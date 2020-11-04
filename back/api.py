from flask import Flask
from flask_mongoengine import MongoEngine
from flask_restful import Api
import rest.itemsRest as rest
import os

app = Flask(__name__)
api = Api(app)
app.config['MONGODB_SETTINGS'] = {
    "host": os.environ.get('MONGO_HOST'),
}
db = MongoEngine(app)

api.add_resource(rest.MyItemList, '/load')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')