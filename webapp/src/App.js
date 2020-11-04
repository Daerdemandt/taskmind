import _ from "lodash/fp";
import ReactDOM from "react-dom";
import React from "react";
import { Mindmap } from 'remindjs';

const Main = () => (
    <div>
		<h1>Hello World!</h1>
        <Mindmap onChange={console.log} />
    </div>
);

ReactDOM.render(
	<Main />, 
	document.getElementById('the-whole-thing')
);


