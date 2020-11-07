from flask_restful import Resource, reqparse


class MyItemList(Resource):

    @classmethod
    def set_mongo(cls, mongo):
        cls.mongo = mongo
        return cls

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('data', type=str, location='json')

    def get(self):
        return [str(x) for x in self.mongo.db.items.find()]

    def put(self):
        args = self.parser.parse_args()
        self.mongo.db.items.insert_one({"data": args["data"]})
        return '200 OK'
