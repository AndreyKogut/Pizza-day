import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import MenuPicker from '../components/MenuPicker';
import Events from '../../api/events/collection';
import Menu from '../../api/menu/collection';

const propTypes = {
  eventId: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
  orderedItems: PropTypes.arrayOf(PropTypes.any),
  isParticipant: PropTypes.bool,
  menu: PropTypes.arrayOf(Object),
  eventLoading: PropTypes.bool,
  menuLoading: PropTypes.bool,
};

const defaultProps = {
  orderedItems: [],
};

class EventPage extends Component {
  constructor(props) {
    super(props);
    this.menu = [];
  }

  getMenu() {
    if (this.props.menuLoading) {
      return <div>Menu loading..</div>;
    }

    return (<MenuPicker
      defaultValue={this.props.orderedItems}
      items={this.props.menu}
      getMenuList={(list) => { this.menu = [...list]; }}
      withCounters
    />);
  }

  joinEvent = () => {
    Meteor.call('events.joinEvent', this.props.eventId, handleMethodsCallbacks);
  };

  leaveEvent = () => {
    Meteor.call('events.leaveEvent', this.props.eventId, handleMethodsCallbacks);
  };

  orderItems = () => {
    const eventId = this.props.eventId;
    const menu = this.menu;

    Meteor.call('events.orderItems', { eventId, menu }, handleMethodsCallbacks);
  };
  render() {
    if (this.props.eventLoading) {
      return <div>Loading event...</div>;
    }

    return (<div className="event-page">
      <ul className="event-page__info">
        <li>Name: { this.props.name }({ this.props.status })</li>
        <li>Title: { this.props.title }</li>
        <li>Date: { this.props.date }</li>
        <li>
          { this.props.isParticipant ?
            <button type="button" onClick={this.leaveEvent}>Leave</button> :
            <button type="button" onClick={this.joinEvent}>Join</button> }
        </li>
      </ul>
      <div className="event-page__menu">
        { this.getMenu() }
      </div>
      <button type="button" onClick={this.orderItems}>Order items</button>
    </div>);
  }
}

EventPage.propTypes = propTypes;
EventPage.defaultProps = defaultProps;

const EventPageContainer = createContainer(({ eventId }) => {
  const handleEvent = Meteor.subscribe('Event', eventId);
  const handleMenu = Meteor.subscribe('EventMenu', eventId);

  const event = Events.findOne() || {};
  const participant = _.findWhere(event.participants, { _id: Meteor.userId() });

  return {
    eventId,
    ...event,
    orderedItems: participant ? participant.menu : [],
    isParticipant: !!participant,
    menu: Menu.find().fetch(),
    eventLoading: !handleEvent.ready(),
    menuLoading: !handleMenu.ready(),
  };
}, EventPage);

export default EventPageContainer;
