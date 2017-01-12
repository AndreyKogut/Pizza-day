import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import MenuPicker from '../components/MenuPicker';
import Menu from '../../api/menu/collection';
import ImagePicker from '../components/ImagePicker';
import UserPicker from '../components/UserPicker';

const propTypes = {
  menu: PropTypes.arrayOf(Object),
  handleMenu: PropTypes.bool,
};

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.createGroup = this.createGroup.bind(this);
    this.state = {
      imageId: null,
      image: '',
    };
  }

  createGroup(event) {
    event.preventDefault();

    const name = this.name.value.trim();
    const description = this.description.value.trim();
    const avatar = this.avatar;
    const menu = this.menu;
    const members = this.users;

    Meteor.call(
      'groups.insert',
      { name, description, avatar, menu, members },
      handleMethodsCallbacks(this.successCreateCallback),
    );
  }

  successCreateCallback = (id) => {
    FlowRouter.go('/groups/:id', { id });
  };

  render() {
    if (this.props.handleMenu) {
      return <div>Loading</div>;
    }

    return (<div className="content page-content">
      <div className="mdl-grid main-header">
        <h3 className="m-auto">Add new group</h3>
      </div>
      <form onSubmit={this.createGroup} className="content page-content">
        <div className="mdl-grid">
          <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <label
              className="mdl-textfield__label"
              htmlFor="name"
            >
              Name:
            </label>
            <input
              type="text"
              ref={(name) => { this.name = name; }}
              id="name"
              className="mdl-textfield__input"
              required
            />
          </div>
        </div>
        <div className="mdl-grid">
          <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <label
              className="mdl-textfield__label"
              htmlFor="description"
            >
              Description:
            </label>
            <textarea
              ref={(description) => { this.description = description; }}
              id="description"
              className="mdl-textfield__input"
            />
          </div>
        </div>
        <div className="mdl-grid">
          <h4>Avatar</h4>
        </div>
        <div className="mdl-grid">
          <ImagePicker
            getImageUrl={(url) => { this.avatar = url; }}
            currentImageUrl={''}
          />
        </div>
        <div className="mdl-grid">
          <h4>Group members</h4>
        </div>
        <div className="mdl-grid">
          <UserPicker getUsersList={(users) => { this.users = users; }} />
        </div>
        <div className="mdl-grid">
          <h4>Group menu</h4>
        </div>
        <div className="mdl-grid">
          <MenuPicker
            items={this.props.menu}
            getMenuList={(data) => { this.menu = [...data]; }}
          />
        </div>
        <div className="mdl-grid mb--30">
          <input
            className="m-auto mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
            type="submit"
            value="Create"
          />
        </div>
      </form>
    </div>);
  }
}

CreateGroup.propTypes = propTypes;

const CreateGroupContainer = createContainer(() => {
  const handleMenu = Meteor.subscribe('Menu');

  const menu = Menu.find().fetch();

  return {
    menuLoading: !handleMenu.ready(),
    menu,
  };
}, CreateGroup);

export default CreateGroupContainer;
