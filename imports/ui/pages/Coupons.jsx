import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { eventsSubsManager } from '../../lib/subsManager';
import Events from '../../api/events/collection';
import { EventUsersList } from '../../ui/components/UsersList';
import { EventMenuList } from '../../ui/components/MenuList';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import showMessage from '../../helpers/showMessage';

const propTypes = {
  id: PropTypes.string,
  eventId: PropTypes.string,
  name: PropTypes.string,
  menu: PropTypes.arrayOf(String),
  showParticipants: PropTypes.arrayOf(String),
};

class Coupons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      menuItem: null,
    };
  }

  sendCallback = () => {
    showMessage('Coupon sent');
    FlowRouter.go('/groups/:id/events/:eventId', {
      id: this.props.id,
      eventId: this.props.eventId,
    });
  };

  sendCoupon = (event) => {
    event.preventDefault();

    const userId = this.state.user._id;
    const eventId = this.props.eventId;
    const itemId = this.state.menuItem._id;
    const freeItems = Number(this.free.value);
    const discount = Number(this.discount.value);

    Meteor.call('events.setCoupon', {
      userId,
      eventId,
      itemId,
      freeItems,
      discount,
    }, handleMethodsCallbacks(this.sendCallback));
  };

  render() {
    return (<div className="content page-content">
      <form onSubmit={this.sendCoupon}>
        <div className="mdl-grid main-header">
          <h3 className="m-auto">Give coupons for { `"${this.props.name}"` }</h3>
        </div>
        <div className="mdl-grid">
          <h4>Pick user</h4>
        </div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--6-col">
            <EventUsersList
              getUserMode
              itemClick={(user) => { this.setState({ user }); }}
              eventId={this.props.eventId}
              showItems={this.props.showParticipants}
            />
          </div>
          <div className="ta-c mdl-cell mdl-cell--6-col">
            { this.state.user && <div className="items-container">
              <img
                src={this.state.user.profile.avatar}
                className="avatar--medium "
                alt={this.state.user.profile.name}
              />
              <p>{this.state.user.profile.name}</p>
              <p>{this.state.user.emails[0].address}</p>
              </div> }
          </div>
        </div>
        <div className="mdl-grid">
          <h4>Pick menu item</h4>
        </div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--6-col">
            <EventMenuList
              picker
              id={this.props.eventId}
              showItems={this.props.menu}
              getItem={(menuItem) => { this.setState({ menuItem }); }}
            />
          </div>
          <div className="ta-c mdl-cell mdl-cell--6-col">
            { this.state.menuItem && <div className="items-container ta-l">
              <h5>{ this.state.menuItem.name }</h5>
              <p>Price: { this.state.menuItem.price }</p>
              <p>Mass: { this.state.menuItem.mass }</p>
              <p>Description: { this.state.menuItem.description }</p>
            </div> }
          </div>
        </div>
        <div className="mdl-grid">
          <h4>Coupon</h4>
        </div>
        <div className="mdl-grid">
          <div className="mdl-grid">
            <div className="ta-c mdl-cell mdl-cell--6-col">
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <label
                  htmlFor="free"
                  className="mdl-textfield__label"
                >Give some items for free:(10 max)</label>
                <input
                  type="number"
                  ref={(item) => { this.free = item; }}
                  className="mdl-textfield__input"
                  id="free"
                  min="0"
                  max="10"
                />
              </div>
            </div>
            <div className="ta-c mdl-cell mdl-cell--6-col">
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <label
                  htmlFor="discount"
                  className="mdl-textfield__label"
                >Discount:(%)</label>
                <input
                  type="number"
                  ref={(item) => { this.discount = item; }}
                  className="mdl-textfield__input"
                  id="discount"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mdl-grid mb--30">
          <input
            className="m-auto mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
            type="submit"
            value="Give coupon"
          />
        </div>
      </form>
    </div>);
  }
}

Coupons.propTypes = propTypes;

const CouponsContainer = createContainer(({ id, eventId }) => {
  eventsSubsManager.subscribe('Event', eventId);

  const event = Events.findOne(eventId) || {};
  const eventParticipantsIds = _.pluck(event.participants, '_id');

  return {
    id,
    showParticipants: eventParticipantsIds,
    menu: event.menu,
    eventId,
    name: event.name,
  };
}, Coupons);

export default CouponsContainer;
