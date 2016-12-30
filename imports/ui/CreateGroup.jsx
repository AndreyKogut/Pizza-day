import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import handleMethodsCallbacks from '../helpers/handleMethodsCallbacks';
import MenuPicker from './MenuPicker';
import Menu from '../api/menu/collection';
import ImagePicker from '../ui/ImagePicker';

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

    Meteor.call(
      'groups.insert',
      { name, description, avatar, menu },
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
      <ul className="group-create__info">
        <li className="group-create__item">
          <ImagePicker
            getImageUrl={(url) => { this.avatar = url; }}
            currentImageUrl={''}
          />
        </li>
        <li className="group-create__item">
          <label className="form__label" htmlFor="name">
          Name:
          </label>
          <input
            type="text"
            ref={(name) => { this.name = name; }}
            id="name"
            className="form__input"
          />
        </li>
        <li className="group-create__item">
          <label className="form__label" htmlFor="description">
          Description:
          </label>
          <textarea
            ref={(description) => { this.description = description; }}
            id="description"
            className="form__textarea"
          />
        </li>
        <li className="group-create__item">
          <input type="submit" value="Create group" />
        </li>
      </ul>
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
