import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { createContainer } from 'meteor/react-meteor-data';

class Header extends Component {
  logout = () => {
    Meteor.logout();
  };

  render() {
    return (<header className="header">
      <nav className="header__nav">
        <ul className="header__list cf">
          <li className="header__item">
            <a href="/" className="header__link">Home</a>
          </li>
          { this.props.id ?
            <li className="header__item header__item_login">
              <a
                className="header__link"
                href={FlowRouter.path('/user/:id', { id: this.props.id })}
              >{ this.props.name }</a>
              <button
                onClick={this.logout}
                className="header__link header__link_logout clear-defaults"
              >Logout</button>
            </li>
            :
            <li className="header__item header__item_login">
              <a href="/signup" className="header__link">Sign up</a>
              <span className="header__separator">/</span>
              <a href="/signin" className="header__link">Sign in</a>
            </li>}
        </ul>
      </nav>
    </header>);
  }
}

Header.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
};

const HeaderContainer = createContainer(() => {
  const id = Meteor.userId();
  const { username: name = 'No name' } = Meteor.user() || {};

  return {
    id,
    name,
  };
}, Header);

export default HeaderContainer;
