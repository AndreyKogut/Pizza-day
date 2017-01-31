import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { GroupMenuPicker } from '../components/pickers/MenuPicker';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import Groups from '../../api/groups/collection';

const propTypes = {
  groupId: PropTypes.string,
  groupMenu: PropTypes.arrayOf(String),
  groupName: PropTypes.string,
  groupLoading: PropTypes.bool,
};

const CreateEvent = (props) => {
  function successCreateCallback(eventId) {
    FlowRouter.go('/groups/:id/events/:eventId', { id: props.groupId, eventId });
  }

  function createEvent(event) {
    event.preventDefault();

    const name = this.eventName.value;
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

  if (props.groupLoading) {
    return <div className="spinner mdl-spinner mdl-js-spinner is-active" />;
  }

  return (<div className="content page-content">
    <div className="mdl-grid main-header">
      <h3 className="m-auto">New event for { `"${props.groupName}"` }</h3>
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
            ref={(name) => { this.eventName = name; }}
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
            required
          />
        </div>
      </div>
      <div className="mdl-grid">
        <h4>Menu</h4>
      </div>
      <div className="mdl-grid">
        <GroupMenuPicker
          groupId={props.groupId}
          getMenuList={(data) => { this.menu = [...data]; }}
          showItems={props.groupMenu}
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
  const handleEvent = Meteor.subscribe('Group', groupId);

  const group = Groups.findOne(groupId) || {};

  return {
    groupId,
    groupMenu: group.menu,
    groupName: group.name,
    groupLoading: !handleEvent.ready(),
  };
}, CreateEvent);

export default CreateEvent;
export {
  CreateEventContainer,
};
