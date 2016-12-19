import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";

import {HeaderContainer} from "../ui/Header";
import {Footer} from "../ui/Footer";

export class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (<div className="app-container">

			{ <HeaderContainer/> }

			<div className="content">
				{ this.props.content }
			</div>

			{ <Footer/> }
			<br/>
		</div>);
	}
}

App.propTypes = {

};

export const AppContainer = createContainer(() => {

	return {
	};
}, App);