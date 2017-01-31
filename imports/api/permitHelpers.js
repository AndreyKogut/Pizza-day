import { Meteor } from 'meteor/meteor';
import Groups from './groups/collection';
import Events from './events/collection';
import Orders from './orders/collection';

const isUserSignedIn = (userId) => {
  if (!userId) {
    throw new Meteor.Error(403, 'Unauthorized');
  }

  return true;
};

const isUserVerified = (userId) => {
  if (!Meteor.users.findOne(userId).emails[0].verified) {
    throw new Meteor.Error(403, 'Unverified');
  }

  return true;
};

const validateUser = (userId) => {
  isUserSignedIn(userId);
  isUserVerified(userId);

  return true;
};

const isUserGroupOwner = (userId, groupId) => {
  const groupCreatorId = Groups.findOne({ _id: groupId }).creator;

  if (groupCreatorId !== userId) {
    throw new Meteor.Error(403, 'Not owner');
  }

  return true;
};

const isUserEventOwner = (userId, eventId) => {
  const event = Events.findOne({
    _id: eventId,
  });

  if (event.creator !== userId) {
    throw new Meteor.Error(403, 'Not owner');
  }

  return true;
};

const isEventOrdered = (eventId) => {
  const event = Events.findOne({ _id: eventId });
  if (event.status !== 'ordering') {
    throw new Meteor.Error(403, 'Event ordered');
  }

  return true;
};

const isEventUserExistInGroup = (userId, eventId) => {
  const event = Events.findOne({ _id: eventId });
  const groupMembers = Groups.findOne({ _id: event.groupId }).members;

  const isMember = _.some(groupMembers, member => _.isEqual(member, {
    _id: userId,
    verified: true,
  }));

  if (!isMember) {
    throw new Meteor.Error(403, 'Not member');
  }

  return true;
};

const isEventOwner = (userId, eventId) => {
  const event = Events.findOne({ _id: eventId });
  if (event.creator !== userId) {
    throw new Meteor.Error(403, 'Not owner');
  }

  return true;
};

const isEventParticipant = (userId, eventId) => {
  const eventData = Events.findOne({ _id: eventId });
  const isParticipant = _.some(eventData.participants, item => item._id === userId);

  if (!isParticipant) {
    throw new Meteor.Error(403, 'Not participant');
  }

  return true;
};

const isOrderOwner = (userId, orderId) => {
  const order = Orders.findOne({ _id: orderId });

  if (order.userId !== userId) {
    throw new Meteor.Error(403, 'Not owner');
  }
};

export {
  isUserSignedIn,
  isUserVerified,
  validateUser,
  isUserGroupOwner,
  isUserEventOwner,
  isEventOrdered,
  isEventUserExistInGroup,
  isEventOwner,
  isEventParticipant,
  isOrderOwner,
};
