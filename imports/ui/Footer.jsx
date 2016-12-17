import React, {Component, PropTypes} from "react";

export class Footer extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (<footer className="footer">
			<a href="https://github.com/AndreyKogut/pizza-day" className="footer__link">Pizza day</a>
		</footer>);
	};
}