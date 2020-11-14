import _ from "lodash/fp";
import ReactDOM from "react-dom";
import React from "react";
import { Mindmap } from 'remindjs';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from "react-redux";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import FormModal from './Form.js';

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

const mkParsedTree = (tree) => {
    const renderTitle = _.prop('content.title');
    const {nodeById, children, rootId} = parseTree(tree);
    const buildMmTree = (id) => {
        const result = mkMmNode(nodeById[id], renderTitle);
        if (children[id]) {
            result.children = {attached: children[id].map(buildMmTree)};
        }
        return result;
    };
    return buildMmTree(rootId);
};

const Tree = ({parsedTree}) => {
    const dispatch = useDispatch();
    const selectNode = (id) => dispatch({type:'SELECT_NODE', payload:id});
    console.log('Tree rendered');
    const handleClick = (e) => {
        const id = _.prop('target.id')(e);
        if (_.isUndefined(id)) {
            selectNode();
            console.log('Unselected');
        } else {
            const nodeId = id.substr(6);
            selectNode(nodeId);
            console.log('Selected ' + `${nodeId}`);
        }
    };
    return <div onClick={handleClick}><Mindmap value={parsedTree} onChange={(...pa) => console.log('Changed', ...pa)}/></div>;
};


const addUniqueId = (node) => (node, node.id = _.uniqueId());

const reducer = (state, action) => {
    if (action.type == 'LOAD_NODES') {
        const tree = action.payload;
        return {tree, parsedTree:mkParsedTree(tree)};
    }
    if (action.type == 'ADD_NODES') {
        //const newNodes = action.payload.map((node) => ({id: _.uniqueId(), ...node}));
        const newNodes = action.payload.map(addUniqueId);
        const tree = [...state.tree, ...newNodes];
        return {tree, parsedTree:mkParsedTree(tree)};
    }
    if (action.type == 'UPDATE_NODES') {
        //const makeUpdater = ([currentValue, newValue]) => _.map((node) => node.id == currentValue.id ? {...node, ...newValue} : node);
        const makeUpdater = ([currentValue, newValue]) => _.map((node) => node.id == currentValue.id ? _.defaults(node)(newValue) : node);
        const tree = _.flow(action.payload.map(makeUpdater))(state.tree);
        return {tree, parsedTree:mkParsedTree(tree)};
    }
    if (action.type == 'DELETE_NODES') {
        const idsToRemove = new Set(action.payload.map(_.prop('id')));
        const tree = state.tree.filter((node) => ! idsToRemove.has(node.id));
    }
    if (action.type == 'SELECT_NODE') {
        return {tree: state.tree, parsedTree:state.parsedTree, currentNodeId:action.payload};
    }
    return state;

};
const store = createStore(
    reducer,
    {parsedTree:mkParsedTree(tree), tree:tree},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const getParsedTree = _.prop('parsedTree');

const Notes = () => {
    const parsedTree = useSelector(getParsedTree);
    return <Tree parsedTree={parsedTree}/>;
};

const Main = () => (
    <div>
        <Provider store={store}>
		    <h1>Hello World!</h1>
            <Notes/>
            <FormModal/>
        </Provider>
    </div>
);

ReactDOM.render(
	<Main />, 
	document.getElementById('the-whole-thing')
);


