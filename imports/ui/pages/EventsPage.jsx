import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
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
    return <div>Loading...</div>;
  }

  return (<div className="content page-content">
    <EventsList items={events} />
  </div>);
};

EventsPage.propTypes = propTypes;
EventsPage.defaultProps = defaultProps;

const EventsPageContainer = createContainer(() => {
  const handleEvents = Meteor.subscribe('Events');

  return {
    events: Events.find().fetch(),
    eventsLoading: !handleEvents.ready(),
  };
}, EventsPage);

export default EventsPageContainer;
