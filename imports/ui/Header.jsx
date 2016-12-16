import React, {Component, PropTypes} from "react";

export class Header extends Component {
	constructor(props) {
		super(props);
	}

	render(){
		return (<header>
			<nav>
				<ul>
					<li><a href="/signin">Sign in</a></li>
					<li><a href="/signup">Sign up</a></li>
					{ this.props.id ? <li><a href={ `/user/${this.props.id}` }>Cabinet</a></li> : "" }
					<li><a href="/">Home</a></li>
				</ul>
			</nav>
		</header>);
	};
}

Header.propTypes = {
	id: PropTypes.string,
};