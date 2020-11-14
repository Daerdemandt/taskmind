class Tree:

    def __init__(self, db):
        self._db = db

    def save_tree(self, project_name: str, tree_data: list):
        collection = self._db[project_name]
        saved_nodes = list()
        for node in tree_data:
            existent_node = collection.find_one_and_replace({"node_id": node["node_id"]}, node)
            if not existent_node:
                saved_nodes.append(str(collection.insert_one(node).inserted_id))
            else:
                saved_nodes.append(str(existent_node["_id"]))
        return saved_nodes

    def get_tree(self, project_name: str):
        collection = self._db[project_name]
        return tuple((node for node in collection.find()))
