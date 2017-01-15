import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Events from './collection';
import Groups from '../groups/collection';
import Orders from '../orders/collection';
import sendUserOrder from '../sendUserOrder';
import { stringList, notEmpty, dateNotPass } from '../checkData';

Meteor.methods({
  'events.insert': function insert(requestData) {
    const requestDataStructure = {
      name: Match.Where(notEmpty),
      groupId: Match.Where(notEmpty),
      date: Match.Where(dateNotPass),
      menu: Match.Maybe(Match.Where(stringList)),
      title: Match.Maybe(String),
    };

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    try {
      check(requestData, requestDataStructure);
    } catch (err) {
      throw new Meteor.Error(400, `Invalid ${err.path}`);
    }

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
    const requestDataStructure = {
      id: Match.Where(notEmpty),
      name: Match.Maybe(String),
      date: Match.Maybe(Match.Where(dateNotPass)),
      title: Match.Maybe(String),
    };

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    try {
      check(requestData, requestDataStructure);
    } catch (err) {
      throw new Meteor.Error(400, `Invalid ${err.path}`);
    }

    const group = Events.findOne({
      _id: requestData.id,
    });

    if (group.creator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    const updateData = _.pick(requestData, value => value);

    if (!_.isEmpty(updateData)) {
      Events.update({ _id: requestData.id }, { $set: { ...updateData } });
    }
  },

  'events.updateStatus': function orderEvent(requestData) {
    const requestDataStructure = {
      id: Match.Where(notEmpty),
      status: Match.Where((data) => {
        const requiredStatus = ['ordering', 'ordered', 'delivering', 'delivered'];

        return _.contains(requiredStatus, data);
      }),
    };

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    try {
      check(requestData, requestDataStructure);
    } catch (err) {
      throw new Meteor.Error(400, `Invalid ${err.path}`);
    }

    const event = Events.findOne({ _id: requestData.id });

    if (event.creator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    Events.update({ _id: requestData.id }, { $set: { status: requestData.status } });

    if (requestData.status !== 'ordering') {
      Events.update({
        _id: requestData.id,
      }, {
        $pull: { participants: { ordered: false } },
      }, (err) => {
        if (!err) {
          sendUserOrder(requestData.id);
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

    if (!_.indexOf(groupMembers, this.userId)) {
      throw new Meteor.Error(403, 'Not member');
    }

    Events.update({ _id: id },
      { $push: { participants: { _id: this.userId, order: '', ordered: false } } },
    );
  },

  'events.addMenuItems': function addMenuItems(requestData) {
    const requestDataStructure = {
      id: Match.Where(notEmpty),
      items: [Match.Where(notEmpty)],
    };

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    try {
      check(requestData, requestDataStructure);
    } catch (err) {
      throw new Meteor.Error(400, `Invalid ${err.path}`);
    }

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
  const groupMembers = Groups.findOne({ _id: groupId }).members;

  if (!_.some(groupMembers, ({ _id: userId }) => userId === this.userId)) {
    return this.ready();
  }

  return Events.find({ _id: id });
});
