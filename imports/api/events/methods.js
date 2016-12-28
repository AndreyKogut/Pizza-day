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

    const groupCreatorId = Groups.findOne({ _id: requestData.groupId }).creator;

    if (groupCreatorId !== this.userId) {
      throw new Meteor.Error(403, 'Access denied');
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
  'events.joinEvent': function addParticipant(eventId) {
    check(eventId, Match.Where(checkData.notEmpty));

    Events.upsert({ _id: eventId }, { $push: { _id: this.userId, menu: [], ordered: false } });
  },
  'events.leave': function deleteParticipant(eventId) {
    check(eventId, Match.Where(checkData.notEmpty));

    Events.update({ _id: eventId }, { $pull: { _id: this.userId } });
  },
});

Meteor.publish('GroupEvents', (id) => {
  check(id, Match.Where(checkData.notEmpty));

  return Events.find({ groupId: id });
});

Meteor.publish('Events', function getEvents() {
  if (!this.userId) {
    throw new Meteor.Error(403, 'Access denied');
  }

  return Events.find({ 'participants._id': this.userId });
});

Meteor.publish('Event', (id) => {
  check(id, Match.Where(checkData.notEmpty));

  return Events.find({ _id: id });
});
