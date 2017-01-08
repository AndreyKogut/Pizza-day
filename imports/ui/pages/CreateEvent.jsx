import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import MenuPickerContainer from '../components/MenuPicker';
import Menu from '../../api/menu/collection';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';

const propTypes = {
  groupId: PropTypes.string,
  menu: PropTypes.arrayOf(Object),
  menuLoading: PropTypes.bool,
};

const CreateEvent = (props) => {
  function successCreateCallback(eventId) {
    FlowRouter.go('/groups/:id/events/:eventId', { id: props.groupId, eventId });
  }

  function createEvent(event) {
    event.preventDefault();

    const name = this.userName.value;
    const title = this.title.value;
    const date = this.date.value;
    const groupId = props.groupId;
    const menu = this.menu ? [...this.menu] : [];

    Meteor.call(
      'events.insert',
      { name, title, date, groupId, menu },
      handleMethodsCallbacks(successCreateCallback),
    );
  }

  if (props.menuLoading) {
    return <div>Loading...</div>;
  }

  return (<form onSubmit={createEvent} className="form event-create">
    <ul className="event-create__list">
      <li className="event-create__item">
        <label className="form__label" htmlFor="name">
          Name:
        </label>
        <input
          type="text"
          ref={(name) => { this.userName = name; }}
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
          type="datetime-local"
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
        items={props.menu}
        getMenuList={(data) => { this.menu = [...data]; }}
      />
    </div>
  </form>);
};

CreateEvent.propTypes = propTypes;

const CreateEventContainer = createContainer(({ groupId }) => {
  const handleMenu = Meteor.subscribe('GroupMenu', groupId);

  const menu = Menu.find().fetch();

  return {
    menu,
    groupId,
    menuLoading: !handleMenu.ready(),
  };
}, CreateEvent);

export default CreateEventContainer;

