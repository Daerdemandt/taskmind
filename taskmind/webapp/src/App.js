import _ from "lodash/fp";
import ReactDOM from "react-dom";
import React from "react";

class Main extends React.Component {
	render() {return (
		<h1>Hello World!</h1>
	);}
}

class App {
}
const app = new App();

const info = {};

ReactDOM.render(
	<Main app={app} info={info}/>, 
	document.getElementById('the-whole-thing')
);


