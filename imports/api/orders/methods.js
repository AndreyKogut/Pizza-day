import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { notEmpty } from '../checkData';
import Events from '../events/collection';
import Orders from './collection';

Meteor.methods({
  'orders.insert': function orderInsert(requestData) {
    const requestDataStructure = {
      eventId: Match.Where(notEmpty),
      menu: [{
        _id: Match.Where(notEmpty),
        count: Number,
      }],
      userId: Match.Where(notEmpty),
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

    const orderId = Orders.insert(orderData);

    Events.update({ _id: eventId, participants: { $elemMatch: { _id: this.userId } } },
      { $set: { 'participants.$.order': orderId, 'participants.$.ordered': true } });

    return orderId;
  },
});

Meteor.publish('Order', function orderInfo(id) {
  check(id, Match.Where(notEmpty));

  if (!this.userId) {
    return this.ready();
  }

  return Orders.find({ _id: id, userId: this.userId });
});
