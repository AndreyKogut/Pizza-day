import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Events from './collection';
import Groups from '../groups/collection';
import Orders from '../orders/collection';
import sendOrders from '../sendOrders';
import { notEmpty, dateNotPass } from '../checkData';

Meteor.methods({
  'events.insert': function insert(requestData) {
    const requestDataStructure = Match.Where((data) => {
      try {
        check(data, {
          name: Match.Where(notEmpty),
          groupId: Match.Where(notEmpty),
          date: Match.Where(dateNotPass),
          menu: Match.Maybe([String]),
          title: Match.Maybe(String),
        });
      } catch (err) {
        throw new Meteor.Error(400, `Invalid ${err.path}`);
      }

      return true;
    });

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    check(requestData, requestDataStructure);

    const groupCreatorId = Groups.findOne({ _id: requestData.groupId }).creator;

    if (groupCreatorId !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

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
          id: Match.Where(notEmpty),
          name: Match.Maybe(Match.Where(notEmpty)),
          date: Match.Maybe(Match.Where(dateNotPass)),
          title: Match.Maybe(Match.Where(notEmpty)),
        });
      } catch (err) {
        throw new Meteor.Error(400, `Invalid ${err.path}`);
      }

      return true;
    });

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    check(requestData, requestDataStructure);

    const { id, ...fieldsToUpdate } = requestData;

    const group = Events.findOne({
      _id: id,
    });

    if (group.creator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    Events.update({ _id: requestData.id }, { $set: fieldsToUpdate });
  },

  'events.updateStatus': function orderEvent(requestData) {
    const requestDataStructure = Match.Where((data) => {
      try {
        check(data, {
          id: Match.Where(notEmpty),
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

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    check(requestData, requestDataStructure);

    const event = Events.findOne({ _id: requestData.id });

    if (event.creator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    Events.update({ _id: requestData.id }, { $set: { status: requestData.status } });

    if (requestData.status === 'ordered') {
      Events.update({
        _id: requestData.id,
      }, {
        $pull: { participants: { ordered: false } },
      }, (err) => {
        if (!err) {
          sendOrders(requestData.id);
        }
      });
    }
  },

  'events.joinEvent': function addParticipant(id) {
    check(id, Match.Where(notEmpty));

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    const event = Events.findOne({ _id: id });
    if (event.status !== 'ordering') {
      throw new Meteor.Error(403, 'Event ordered');
    }

    const groupMembers = Groups.findOne({ _id: event.groupId }).members;

    const isMember = _.some(groupMembers, member => _.isEqual(member, {
      _id: Meteor.userId(),
      verified: true,
    }));

    if (!isMember) {
      throw new Meteor.Error(403, 'Not member');
    }

    Events.update({ _id: id },
      { $push: { participants: { _id: this.userId, order: '', ordered: false, coupons: [] } } },
    );
  },

  'events.addMenuItems': function addMenuItems(requestData) {
    const requestDataStructure = Match.Where((data) => {
      check(data, {
        id: Match.Where(notEmpty),
        items: [Match.Where(notEmpty)],
      });

      return true;
    });

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    check(requestData, requestDataStructure);

    const event = Events.findOne({ _id: requestData.id });
    if (event.status !== 'ordering') {
      throw new Meteor.Error(403, 'Event ordered');
    }

    if (event.creator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    Events.update({ _id: requestData.id }, { $push: { menu: { $each: requestData.items } } });
  },

  'events.leaveEvent': function deleteParticipant(eventId) {
    check(eventId, Match.Where(notEmpty));

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    const event = Events.findOne({ _id: eventId });

    if (event.status !== 'ordering') {
      throw new Meteor.Error(403, 'Event ordered');
    }

    Events.update({ _id: eventId },
      { $pull: { participants: { _id: this.userId } } },
    );
  },

  'events.removeOrdering': function orderEventItems(eventId) {
    check(eventId, Match.Where(notEmpty));

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    const event = Events.findOne({ _id: eventId });
    if (event.status !== 'ordering') {
      throw new Meteor.Error(403, 'Event ordered');
    }

    const eventParticipant = _.findWhere(event.participants, { _id: this.userId });

    Events.update({ _id: eventId, participants: { $elemMatch: { _id: this.userId } } },
      { $set: { 'participants.$.ordered': false, 'participants.$.order': '' } },
    );

    Orders.remove({ _id: eventParticipant.order });
  },

  'events.setCoupon': function setCoupon(requestData) {
    const requestDataStructure = Match.Where((data) => {
      try {
        check(data, {
          eventId: Match.Where(notEmpty),
          userId: Match.Where(notEmpty),
          itemId: Match.Where(notEmpty),
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

    check(requestData, requestDataStructure);

    const { eventId, userId, ...coupon } = requestData;

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    const event = Events.findOne(eventId) || {};

    if (this.userId !== event.creator) {
      throw new Meteor.Error(403, 'Not owner');
    }

    if (event.status !== 'ordering') {
      throw new Meteor.Error(403, 'Event ordered');
    }

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

Meteor.publish('GroupEvents', (id) => {
  check(id, Match.Where(notEmpty));

  return Events.find({ groupId: id });
});

Meteor.publish('Events', function getEvents() {
  if (!this.userId) {
    return this.ready();
  }

  return Events.find({ $or: [{ 'participants._id': this.userId }, { creator: this.userId }] });
});

Meteor.publish('Event', function publishEvent(id) {
  check(id, Match.Where(notEmpty));

  const groupId = Events.findOne({ _id: id }).groupId;
  const group = Groups.findOne({ _id: groupId });

  const groupMember = _.some(group.members, member => _.isEqual(member, {
    _id: Meteor.userId,
    verified: true,
  }));

  if (!groupMember && !group.creator) {
    return this.ready();
  }

  return Events.find({ _id: id,
    $or: [{
      'participants._id': this.userId,
    }, {
      creator: this.userId,
    }],
  });
});
