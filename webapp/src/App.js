import _ from "lodash/fp";
import ReactDOM from "react-dom";
import React from "react";
import { Mindmap } from 'remindjs';

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
    return <Mindmap value={buildMmTree(rootId)}/>;
};

const Tree = treeRenderer();

const Main = () => (
    <div>
		<h1>Hello World!</h1>
        <Tree data={tree} />
    </div>
);

ReactDOM.render(
	<Main />, 
	document.getElementById('the-whole-thing')
);


