import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { notEmpty } from '../checkData';
import Events from '../events/collection';
import Orders from './collection';
import Menu from '../menu/collection';

Meteor.methods({
  'orders.insert': function orderInsert(requestData) {
    const requestDataStructure = {
      eventId: Match.Where(notEmpty),
      menu: [{
        _id: Match.Where(notEmpty),
        count: Number,
      }],
    };

    check(requestData, requestDataStructure);

    if (!this.userId) {
      throw new Meteor.Error(402, 'Not member');
    }

    const { eventId, ...orderData } = requestData;
    const eventData = Events.findOne({ _id: eventId });
    const isParticipant = _.some(eventData.participants, item => item._id === this.userId);

    if (!isParticipant) {
      throw new Meteor.Error(402, 'Not member');
    }

    let totalPrice = 0;

    const orderMenu = _.pluck(requestData.menu, '_id');

    const orderMenuItems = Menu.find({ _id: { $in: orderMenu } }).fetch();

    _.map([...orderMenuItems], (item) => {
      totalPrice += item.price * _.findWhere(requestData.menu, { _id: item._id }).count;
    });

    const orderId = Orders.insert({ userId: this.userId, totalPrice, ...orderData });

    Events.update({ _id: eventId, participants: { $elemMatch: { _id: this.userId } } },
      { $set: { 'participants.$.order': orderId, 'participants.$.ordered': true } });

    return orderId;
  },

  'orders.remove': function removeOrder(id) {
    check(id, Match.Where(notEmpty));

    const order = Orders.findOne({ _id: id });

    if (order.userId !== this.userId) {
      throw new Meteor.Error(402, 'Not owner');
    }

    Orders.remove({ _id: id });
  },
});

Meteor.publish('Order', function orderInfo(id) {
  check(id, Match.Where(notEmpty));

  if (!this.userId) {
    return this.ready();
  }

  return Orders.find({ _id: id, userId: this.userId });
});
