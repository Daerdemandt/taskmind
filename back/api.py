from flask import Flask
from flask_restful import Api
from flask_pymongo import PyMongo
import rest.itemsRest as rest
import os

app = Flask(__name__)
api = Api(app)
mongo = PyMongo(app, uri=os.environ.get('MONGO_HOST'))
api.add_resource(rest.MyItemList.set_mongo(mongo), '/load')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')