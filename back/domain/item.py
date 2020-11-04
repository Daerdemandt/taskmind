import mongoengine as me


class MyItem(me.Document):
    item_id = me.UUIDField()
    data = me.StringField()
