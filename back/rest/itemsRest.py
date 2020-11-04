from flask_restful import Resource, reqparse

from domain.item import MyItem


class MyItemList(Resource):

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('data', type=str, location='json')

    def get(self):
        return [x for x in MyItem.objects()]

    def put(self):
        args = self.parser.parse_args()
        return args['data']
