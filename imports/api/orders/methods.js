import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { notEmpty } from '../checkData';
import Events from '../events/collection';
import Orders from './collection';
import Menu from '../menu/collection';
import {
  validateUser,
  isEventParticipant,
  isOrderOwner,
} from '../permitHelpers';

Meteor.methods({
  'orders.insert': function orderInsert(requestData) {
    const requestDataStructure = Match.Where((data) => {
      try {
        check(data, {
          eventId: notEmpty(),
          menu: [{
            _id: notEmpty(),
            count: Number,
          }],
        });
      } catch (err) {
        throw new Meteor.Error(400, `Invalid ${err.path}`);
      }

      return true;
    });

    validateUser(this.userId);

    check(requestData, requestDataStructure);

    const { eventId, ...orderData } = requestData;

    isEventParticipant(this.userId, eventId);

    const orderMenu = _.pluck(requestData.menu, '_id');

    const orderMenuItems = Menu.find({ _id: { $in: orderMenu } }).fetch();

    const totalPrice = _.reduce(orderMenuItems, (sum, num) =>
      sum + (num.price * _.findWhere(requestData.menu, { _id: num._id }).count), 0,
    );

    const orderId = Orders.insert({ userId: this.userId, totalPrice, ...orderData });

    Events.update({ _id: eventId, participants: { $elemMatch: { _id: this.userId } } },
      { $set: { 'participants.$.order': orderId, 'participants.$.ordered': true } });

    return orderId;
  },

  'orders.remove': function removeOrder(id) {
    check(id, notEmpty());

    validateUser(this.userId);

    isOrderOwner(this.userId, id);

    Orders.remove({ _id: id });
  },
});

Meteor.publish('Order', function orderInfo(id) {
  check(id, notEmpty());

  if (!this.userId) {
    return this.ready();
  }

  return Orders.find({ _id: id, userId: this.userId });
});
