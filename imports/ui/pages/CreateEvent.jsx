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

  return (<div className="content page-content">
    <div className="mdl-grid main-header">
      <h3 className="m-auto">New event</h3>
    </div>
    <form onSubmit={createEvent}>
      <div className="mdl-grid main-header">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <label
            className="mdl-textfield__label"
            htmlFor="name"
          >
            Name:
          </label>
          <input
            type="text"
            ref={(name) => { this.userName = name; }}
            id="name"
            className="mdl-textfield__input"
          />
        </div>
      </div>
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <label
            className="mdl-textfield__label"
            htmlFor="title"
          >
            Title:
          </label>
          <textarea
            ref={(title) => { this.title = title; }}
            id="title"
            className="mdl-textfield__input"
          />
        </div>
      </div>
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield">
          <input
            type="datetime-local"
            ref={(date) => { this.date = date; }}
            className="mdl-textfield__input"
          />
        </div>
      </div>
      <div className="mdl-grid">
        <h4>Menu</h4>
      </div>
      <div className="mdl-grid">
        <MenuPickerContainer
          items={props.menu}
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

