import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Events from './collection';
import Groups from '../groups/collection';
import { stringList, notEmpty, dateNotPass } from '../checkData';

Meteor.methods({
  'events.insert': function insert(requestData) {
    const requestDataStructure = {
      name: Match.Where(notEmpty),
      groupId: Match.Where(notEmpty),
      date: Match.Where(dateNotPass),
      menu: Match.Where(stringList),
      title: Match.Maybe(String),
    };

    check(requestData, requestDataStructure);

    const groupCreatorId = Groups.findOne({ _id: requestData.groupId }).creator;

    if (groupCreatorId !== this.userId) {
      throw new Meteor.Error(400, 'Access denied');
    }

    const id = new Meteor.Collection.ObjectID().valueOf();

    Events.insert({
      _id: id,
      participants: [],
      status: 'ordering',
      creator: this.userId,
      createdAt: new Date(),
      ...requestData,
    });

    return id;
  },

  'events.update': function updateEvent(requestData) {
    const requestDataStructure = {
      id: String,
      name: Match.Maybe(String),
      date: Match.Maybe(Match.Where(dateNotPass)),
      title: Match.Maybe(String),
      menu: Match.Maybe([String]),
    };

    check(requestData, requestDataStructure);

    const checkMemberExistInGroup = Events.findOne({
      _id: requestData.id,
    }).creator === this.userId;

    if (!checkMemberExistInGroup) {
      throw new Meteor.Error(402, 'You should be group creator');
    }

    const updateData = _.pick(requestData, value => value);

    Events.update({ _id: requestData.id }, updateData);
  },

  'events.orderEvent': function orderEvent(id) {
    check(id, String);

    const checkMemberExistInGroup = Events.findOne({
      _id: id,
    }).creator === this.userId;

    if (!checkMemberExistInGroup) {
      throw new Meteor.Error(402, 'You should be group creator');
    }

    Events.update({ _id: id }, { status: 'ordered' });
  },

  'events.joinEvent': function addParticipant(id) {
    check(id, Match.Where(notEmpty));

    const groupId = Events.findOne({ _id: id }).groupId;

    const groupMembers = Groups.findOne({ _id: groupId }).members;

    if (!_.indexOf(groupMembers, this.userId)) {
      throw new Meteor.Error(402, 'Access denied');
    }

    Events.update({ _id: id },
      { $push: { participants: { _id: this.userId, menu: [], ordered: false } } },
    );
  },

  'events.leaveEvent': function deleteParticipant(eventId) {
    check(eventId, Match.Where(notEmpty));

    Events.update({ _id: eventId },
      { $pull: { participants: { _id: this.userId } } },
    );
  },

  'events.orderItems': function orderEventItems({ eventId, menu }) {
    const menuObjectStructure = [{
      _id: Match.Where(notEmpty),
      count: Number,
    }];

    check(menu, menuObjectStructure);

    Events.update({ _id: eventId, participants: { $elemMatch: { _id: this.userId } } },
      { $set: { 'participants.$.ordered': !!menu.length, 'participants.$.menu': menu } },
    );
  },
});

Meteor.publish('GroupEvents', (id) => {
  check(id, Match.Where(notEmpty));

  return Events.find({ groupId: id });
});

Meteor.publish('Events', function getEvents() {
  if (!this.userId) {
    return this.error(new Meteor.Error(401, 'Access denied'));
  }

  return Events.find({ 'participants._id': this.userId });
});

Meteor.publish('Event', function publishEvent(id) {
  check(id, Match.Where(notEmpty));

  const groupId = Events.findOne({ _id: id }).groupId;
  const groupMembers = Groups.findOne({ _id: groupId }).members;

  if (!_.some(groupMembers, ({ _id: userId }) => userId === this.userId)) {
    return this.error(new Meteor.Error(400, 'Access denied'));
  }

  return Events.find({ _id: id });
});
