import React, {Component, PropTypes} from "react";

export class Footer extends Component {
	constructor(props) {
		super(props);
	}
	
	render(){
		return (<footer>
			<a href="https://github.com/AndreyKogut/pizza-day">Pizza day</a>
		</footer>);
	};
}