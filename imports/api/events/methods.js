import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Events from './collection';
import Groups from '../groups/collection';
import checkData from '../checkData';

Meteor.methods({
  'events.insert': function insert(requestData) {
    const requestDataStructure = {
      name: String,
      groupId: String,
      date: String,
      menu: [String],
      title: Match.Maybe(String),
    };

    check(requestData, requestDataStructure);
    check(requestData.name, Match.Where(checkData.notEmpty));
    check(requestData.groupId, Match.Where(checkData.notEmpty));
    check(requestData.date, Match.Where(checkData.dateNotPass));
    check(requestData.menu, Match.Where(checkData.stringList));

    const { groupId, ...eventData } = requestData;
    const groupCreatorId = Groups.findOne({ _id: groupId }).creator;

    if (groupCreatorId !== this.userId) {
      throw new Meteor.Error(400, 'Access denied');
    }

    const id = new Meteor.Collection.ObjectID().valueOf();

    Events.insert({
      _id: id,
      participants: [],
      status: 'ordering',
      creator: requestData.groupId,
      createdAt: new Date(),
      ...eventData,
    });

    Groups.upsert({
      _id: groupId,
    }, { $push: { events: id } });

    return id;
  },

  'events.joinEvent': function addParticipant(id) {
    check(id, Match.Where(checkData.notEmpty));

    const checkMemberExistInGroup = Groups.findOne({ events: id, 'members._id': this.userId }).count();

    if (!checkMemberExistInGroup) {
      throw new Meteor.Error(400, 'Access denied');
    }

    Events.upsert({ _id: id }, { $push: { _id: this.userId, menu: [], ordered: false } });
  },

  'events.leave': function deleteParticipant(eventId) {
    check(eventId, Match.Where(checkData.notEmpty));

    Events.update({ _id: eventId }, { $pull: { _id: this.userId } });
  },
});

Meteor.publish('GroupEvents', (id) => {
  check(id, Match.Where(checkData.notEmpty));

  const groupEvents = Groups.findOne(id).events || [];

  return Events.find({ _id: { $in: [...groupEvents] } });
});

Meteor.publish('Events', function getEvents() {
  if (!this.userId) {
    return this.error(new Meteor.Error(401, 'Access denied'));
  }

  return Events.find({ 'participants._id': this.userId });
});

Meteor.publish('Event', function publishEvent(id) {
  check(id, Match.Where(checkData.notEmpty));

  const checkMemberExistInGroup = Groups.find({ events: id, 'members._id': this.userId }).fetch();

  if (!checkMemberExistInGroup.length) {
    return this.error(new Meteor.Error(400, 'Access denied'));
  }

  return Events.find({ _id: id });
});
