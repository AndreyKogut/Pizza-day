import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";

export class Header extends Component {
	constructor(props) {
		super(props);
	}

	logout() {

		Meteor.logout((err) => {
			if (err) {
				console.log(err);
			}
		});
	}

	render() {
		return (<header className="header">
			<nav className="header__nav">
				<ul className="header__list cf">
					<li className="header__item">
						<a href="/" className="header__link">Home</a>
					</li>
					{ this.props.id ?
						<li className="header__item header__item_login">
							<a className="header__link"
								 href={ FlowRouter.path('/user/:id', {id: this.props.id}) }> { this.props.name }</a>
							<button onClick={ this.logout.bind(this) }
											className="header__link header__link_logout clear-defaults">Logout
							</button>
						</li>
						:
						<li className="header__item header__item_login">
							<a href="/signup" className="header__link">Sign up</a>/
							<a href="/signin" className="header__link">Sign in</a>
						</li>  }
				</ul>
			</nav>
		</header>);
	};
}

Header.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
};

export const HeaderContainer = createContainer(() => {
	let {
		_id : id,
		profile : {
			name = 'No name',
		} = {}
	} = Meteor.user() || {};

	return {
		id,
		name
	}
}, Header);
