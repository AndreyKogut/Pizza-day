import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import MenuPickerContainer from './MenuPicker';
import Menu from '../api/menu/collection';
import handleMethodsCallbacks from '../helpers/methods';

const propTypes = {
  id: PropTypes.string,
  menu: PropTypes.arrayOf(Object),
  menuLoading: PropTypes.bool,
};

class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.createEvent = this.createEvent.bind(this);
    this.menu = [];
  }

  createEvent(event) {
    event.preventDefault();

    const name = this.name.value.trim();
    const title = this.title.value.trim();
    const date = this.date.value;
    const groupId = this.props.id;
    const menu = [...this.menu];

    Meteor.call(
      'events.insert',
      { name, title, date, groupId, menu },
      handleMethodsCallbacks(this.successCreateCallback),
    );
  }

  successCreateCallback = (eventId) => {
    FlowRouter.go('/groups/:id/events/:eventId', { id: this.props.id, eventId });
  };

  render() {
    if (this.props.menuLoading) {
      return <div>Loading...</div>;
    }

    return (<form onSubmit={this.createEvent} className="form event-create">
      <ul className="event-create__list">
        <li className="event-create__item">
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
        <li className="event-create__item">
          <label className="form__label" htmlFor="title">
            Title:
          </label>
          <textarea
            ref={(title) => { this.title = title; }}
            id="title"
            className="form__textarea"
          />
        </li>
        <li className="event-create__item">
          <label htmlFor="date" className="event-create__label">
            Date:
          </label>
          <input
            type="date"
            ref={(date) => { this.date = date; }}
            className="event-create__input"
          />
        </li>
        <li className="event-create__item">
          <input type="submit" value="Create event" />
        </li>
      </ul>
      <div className="event-create__menu">
        <MenuPickerContainer
          items={this.props.menu}
          getMenuList={(data) => { this.menu = [...data]; }}
        />
      </div>
    </form>);
  }
}

CreateEvent.propTypes = propTypes;

const CreateEventContainer = createContainer(({ id }) => {
  const handleMenu = Meteor.subscribe('GroupMenu', id);

  const menu = Menu.find().fetch();

  return {
    menu,
    id,
    menuLoading: !handleMenu.ready(),
  };
}, CreateEvent);

export default CreateEventContainer;

