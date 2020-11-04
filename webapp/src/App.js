import _ from "lodash/fp";
import ReactDOM from "react-dom";
import React from "react";
import { Mindmap } from 'remindjs';

const onc = (...params) => console.log('onc!')

const pow2 = (n) => n < 2 ? 0 : 1 + pow2(_.floor(n / 2));

const nb = (n) => ({
    id: _.uniqueId(),
    title: `${n}`,
    side: 'right',
});

const mkNode = (n) => {
    const result = nb(n);
    const p2 = pow2(n);
    if (p2) {
        result.children = {attached:[]};
        result.children.attached.push(nb(Math.pow(2, p2)));
        result.children.attached.push(mkNode(n - Math.pow(2, p2)));
    }
    return result;
};

const Main = () => (
    <div>
		<h1>Hello World!</h1>
        <Mindmap value={mkNode(10669)} onChange={onc} />
    </div>
);

ReactDOM.render(
	<Main />, 
	document.getElementById('the-whole-thing')
);


