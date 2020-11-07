import _ from "lodash/fp";
import ReactDOM from "react-dom";
import React from "react";
import { Mindmap } from 'remindjs';
import { createStore } from 'redux';
import { Provider } from "react-redux";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

const tree = [
    {id: 1, parent:null, content:{title: 'this is root'}},
    {id: 2, parent:1, content:{title: 'this has parent and child'}},
    {id: 3, parent:1, content:{title: 'this is leaf'}},
    {id: 4, parent:2, content:{title:'this is also leaf'}},
];

const parseTree = (tree) => ({
    nodeById: _.keyBy('id')(tree),
    children: _.flow(_.groupBy('parent'), _.mapValues(_.map(_.prop('id'))))(tree),
    rootId: tree.filter(_.isMatch({parent:null}))[0].id
});

const mkMmNode = (node, renderTitle) => ({
    id: node.id,
    title: renderTitle(node),
    side: 'right',
    children: {attached:[]}
});

const treeRenderer = (renderTitle = _.prop('content.title')) => ({data}) => {
    const {nodeById, children, rootId} = parseTree(data);
    const buildMmTree = (id) => {
        const result = mkMmNode(nodeById[id], renderTitle);
        if (children[id]) {
            result.children = {attached: children[id].map(buildMmTree)};
        }
        return result;
    };
    const handleClick = (e) => {
        const id = _.prop('target.id')(e);
        if (_.isUndefined(id)) {
            console.log('Unselected');
        } else {
            const nodeId = id.substr(6);
            console.log('Selected ' + `${nodeId}`);


        }
    };
    return <div onClick={handleClick}><Mindmap value={buildMmTree(rootId)} onChange={(...pa) => console.log('Changed', ...pa)}/></div>;
};


const reducer = (state={tree:[]}, action) => state;
const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


const Tree = treeRenderer();

const Main = () => (
    <div>
        <Provider store={store}>
		    <h1>Hello World!</h1>
            <Tree data={tree}/>
        </Provider>
    </div>
);

ReactDOM.render(
	<Main />, 
	document.getElementById('the-whole-thing')
);


