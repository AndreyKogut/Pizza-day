import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Events from './collection';
import Groups from '../groups/collection';
import Orders from '../orders/collection';
import sendOrders from '../sendOrders';
import { notEmpty, dateNotPass } from '../checkData';
import {
  validateUser,
  isUserGroupOwner,
  isUserEventOwner,
  isEventOrdered,
  isEventUserExistInGroup,
  isEventOwner,
} from '../permitHelpers';

Meteor.methods({
  'events.insert': function insert(requestData) {
    const requestDataStructure = Match.Where((data) => {
      try {
        check(data, {
          name: notEmpty(),
          groupId: notEmpty(),
          date: dateNotPass(),
          menu: Match.Maybe([String]),
          title: Match.Maybe(String),
        });
      } catch (err) {
        throw new Meteor.Error(400, `Invalid ${err.path}`);
      }

      return true;
    });

    validateUser(this.userId);

    check(requestData, requestDataStructure);

    isUserGroupOwner(this.userId, requestData.groupId);

    return Events.insert({
      participants: [],
      status: 'ordering',
      creator: this.userId,
      createdAt: new Date(),
      ...requestData,
    });
  },

  'events.update': function updateEvent(requestData) {
    const requestDataStructure = Match.Where((data) => {
      try {
        check(data, {
          id: notEmpty(),
          name: Match.Maybe(notEmpty()),
          date: Match.Maybe(dateNotPass()),
          title: Match.Maybe(notEmpty()),
        });
      } catch (err) {
        throw new Meteor.Error(400, `Invalid ${err.path}`);
      }

      return true;
    });

    validateUser(this.userId);

    check(requestData, requestDataStructure);

    const { id, ...fieldsToUpdate } = requestData;

    isUserEventOwner(this.userId, id);

    Events.update({ _id: requestData.id }, { $set: fieldsToUpdate });
  },

  'events.updateStatus': function orderEvent(requestData) {
    const requestDataStructure = Match.Where((data) => {
      try {
        check(data, {
          id: notEmpty(),
          status: Match.Where((status) => {
            const requiredStatus = ['ordering', 'ordered', 'delivering', 'delivered'];

            return _.contains(requiredStatus, status);
          }),
        });
      } catch (err) {
        throw new Meteor.Error(400, `Invalid ${err.path}`);
      }

      return true;
    });

    validateUser(this.userId);

    check(requestData, requestDataStructure);

    isUserEventOwner(this.userId, requestData.id);

    Events.update({ _id: requestData.id }, { $set: { status: requestData.status } });

    if (requestData.status === 'ordered') {
      Events.update({
        _id: requestData.id,
      }, {
        $pull: { participants: { ordered: false } },
      });
      sendOrders(requestData.id);
    }
  },

  'events.joinEvent': function addParticipant(id) {
    check(id, notEmpty());

    validateUser(this.userId);

    isEventOrdered(id);

    isEventUserExistInGroup(this.userId, id);

    Events.update({ _id: id },
      { $push: { participants: { _id: this.userId, order: '', ordered: false, coupons: [] } } },
    );
  },

  'events.addMenuItems': function addMenuItems(requestData) {
    const requestDataStructure = Match.Where((data) => {
      check(data, {
        id: notEmpty(),
        items: [notEmpty()],
      });

      return true;
    });

    validateUser(this.userId);

    check(requestData, requestDataStructure);

    isEventOrdered(requestData.id);

    isEventOwner(this.userId, requestData.id);

    Events.update({ _id: requestData.id }, { $push: { menu: { $each: requestData.items } } });
  },

  'events.leaveEvent': function deleteParticipant(eventId) {
    check(eventId, notEmpty());

    validateUser(this.userId);

    isEventOrdered(eventId);

    Events.update({ _id: eventId },
      { $pull: { participants: { _id: this.userId } } },
    );
  },

  'events.removeOrdering': function orderEventItems(eventId) {
    check(eventId, notEmpty());

    validateUser(this.userId);

    isEventOrdered(eventId);

    Events.update({ _id: eventId, participants: { $elemMatch: { _id: this.userId } } },
      { $set: { 'participants.$.ordered': false, 'participants.$.order': '' } },
    );

    Orders.remove({ _id: this.userId });
  },

  'events.setCoupon': function setCoupon(requestData) {
    const requestDataStructure = Match.Where((data) => {
      try {
        check(data, {
          eventId: notEmpty(),
          userId: notEmpty(),
          itemId: notEmpty(),
          freeItems: Match.Maybe(Number),
          discount: Match.Maybe(Number),
        });

        if (!data.freeItems && !data.discount) {
          throw new Meteor.Error();
        }
      } catch (err) {
        throw new Meteor.Error(400, 'Invalid coupon');
      }

      return true;
    });

    validateUser(this.userId);

    check(requestData, requestDataStructure);

    const { eventId, userId, ...coupon } = requestData;

    isEventOwner(this.userId, eventId);

    isEventOrdered(eventId);

    const { itemId, ...discounts } = coupon;

    Events.update(
      { _id: eventId, participants: { $elemMatch: { _id: userId } } }, {
        $push: {
          'participants.$.coupons': {
            $each: [{ _id: itemId, ...discounts }],
            $position: 0,
          },
        },
      },
    );
  },
});

Meteor.publish('GroupEvents', function groupEvents(id) {
  check(id, notEmpty());

  if (!this.userId) {
    return this.ready();
  }

  return Events.find({ groupId: id });
});

Meteor.publish('Events', function getEvents() {
  if (!this.userId) {
    return this.ready();
  }

  return Events.find({ $or: [{ 'participants._id': this.userId }, { creator: this.userId }] });
});

Meteor.publish('Event', function publishEvent(id) {
  check(id, notEmpty());

  if (!this.userId) {
    return this.ready();
  }

  const event = Events.findOne({ _id: id });

  if (!event) {
    return this.ready();
  }

  const group = Groups.findOne({ _id: event.groupId });

  const groupMember = _.some(group.members, member => _.isEqual(member, {
    _id: this.userId,
    verified: true,
  }));

  if (!groupMember && !group.creator) {
    return this.ready();
  }

  return Events.find({ _id: id });
});
