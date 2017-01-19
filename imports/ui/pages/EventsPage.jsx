import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { eventsSubsManager } from '../../lib/subsManager';
import EventsList from '../components/EventsList';
import Events from '../../api/events/collection';

const propTypes = {
  events: PropTypes.arrayOf(Object),
  eventsLoading: PropTypes.bool,
};

const defaultProps = {
  events: [{}],
};

const EventsPage = ({ events, eventsLoading }) => {
  if (eventsLoading) {
    return <div className="spinner mdl-spinner mdl-js-spinner is-active" />;
  }

  if (!events.length) {
    return <div className="empty-list empty-list--big" />;
  }

  return (<div className="content page-content">
    <EventsList items={events} />
  </div>);
};

EventsPage.propTypes = propTypes;
EventsPage.defaultProps = defaultProps;

const EventsPageContainer = createContainer(() => {
  const handleEvents = eventsSubsManager.subscribe('Events');

  return {
    events: Events.find({ $or: [
      { 'participants._id': Meteor.userId() },
      { creator: Meteor.userId() },
    ] }).fetch(),
    eventsLoading: !handleEvents.ready(),
  };
}, EventsPage);

export default EventsPageContainer;
