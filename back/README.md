# testing queries
curl -X PUT --data '{"data": "dsfgsgsg"}' -H "Content-Type: application/json" 'localhost:5000/load'

# expected dto format
for save
```
{ 
"project": "second",
"tree": [
 {"node_id": "1", "parent_id":null, "content":{"title": "this is root"}},                                                                                                                                                                              
 {"node_id": "2", "parent_id":"1", "content":{"title": "this has parent and child"}},                                                                                                                                                                    
 {"node_id": "3", "parent_id":"1", "content":{"title": "this is leaf"}},                                                                                                                                                                                 
 {"node_id": "4", "parent_id":"2", "content":{"title": "this is also leaf"}}
]}
``` 
on get
```
{ tree: [
 {node_id: 1, parent:null, content:{title: 'this is root'}},                                                                                                                                                                              
 {node_id: 2, parent:1, content:{title: 'this has parent and child'}},                                                                                                                                                                    
 {node_id: 3, parent:1, content:{title: 'this is leaf'}},                                                                                                                                                                                 
 {node_id: 4, parent:2, content:{title:'this is also leaf'}},
]}
``` 
