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

    return (<form onSubmit={this.createGroup} className="form group-create">
      <div className="group-create__info">
        <div className="group-create__item">
          <ImagePicker
            getImageUrl={(url) => { this.avatar = url; }}
            currentImageUrl={''}
          />
        </div>
        <p className="group-create__item">
          <label className="form__label" htmlFor="name">
          Name:
          </label>
          <input
            type="text"
            ref={(name) => { this.name = name; }}
            id="name"
            className="form__input"
          />
        </p>
        <p className="group-create__item">
          <label className="form__label" htmlFor="description">
          Description:
          </label>
          <textarea
            ref={(description) => { this.description = description; }}
            id="description"
            className="form__textarea"
          />
        </p>
        <p className="group-create__item">
          <input type="submit" value="Create group" />
        </p>
      </div>
      <h3 className="group-create__h">Group members</h3>
      <div className="group-create__user-picker">
        <UserPicker getUsersList={(users) => { this.users = users; }} />
      </div>
      <h3 className="group-create__h">Group menu</h3>
      <div className="group-create__menu">
        <MenuPicker
          items={this.props.menu}
          getMenuList={(data) => { this.menu = [...data]; }}
        />
      </div>
    </form>);
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
