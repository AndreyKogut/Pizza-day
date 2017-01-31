import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check, Match } from 'meteor/check';
import { notEmpty } from '../checkData';
import Groups from '../../api/groups/collection';
import Events from '../../api/events/collection';
import { validateUser } from '../permitHelpers';

Accounts.onCreateUser((publicData, privateData) => {
  if (privateData.services.google) {
    const emails = [{
      address: privateData.services.google.email,
      verified: privateData.services.google.verified_email,
    }];

    const userProfile = {
      avatar: privateData.services.google.picture,
      ...publicData.profile,
    };

    return { emails, profile: userProfile, ...privateData };
  }

  return {
    profile: {
      avatar: '/images/user-image.png',
      ...publicData.profile,
    },
    ...privateData,
  };
});

Meteor.users.deny({
  update() {
    return true;
  },
});

Meteor.methods({
  'user.insert': function insert(requestData) {
    const requestDataStructure = Match.Where((data) => {
      try {
        check(data, {
          email: notEmpty(),
          password: notEmpty(),
          name: notEmpty(),
          about: Match.Maybe(String),
          company: Match.Maybe(String),
          position: Match.Maybe(String),
        });
      } catch (err) {
        throw new Meteor.Error(400, `Invalid ${err.path}`);
      }

      return true;
    });

    check(requestData, requestDataStructure);

    const { email, password, ...profile } = requestData;

    const userId = Accounts.createUser({
      email,
      password,
      profile: {
        avatar: '/images/user-avatar.png',
        ...profile,
      },
    });

    try {
      Accounts.sendVerificationEmail(userId, email);
    } catch (err) {
      Meteor.users.remove({ _id: userId });

      throw new Meteor.Error(403, 'Invalid email');
    }

    return {
      email: requestData.email,
      password: requestData.password,
    };
  },

  'user.update': function update(requestData) {
    const requestDataStructure = Match.Where((data) => {
      check(data, {
        name: Match.Maybe(String),
        avatar: Match.Maybe(String),
        about: Match.Maybe(String),
        company: Match.Maybe(String),
        position: Match.Maybe(String),
      });

      return true;
    });

    validateUser(this.userId);

    check(requestData, requestDataStructure);

    const updateFields = {
      'profile.name': requestData.name,
      'profile.avatar': requestData.avatar,
      'profile.about': requestData.about,
      'profile.company': requestData.company,
      'profile.position': requestData.position,
    };

    // pick not empty items

    const updateData = _.pick(updateFields, value => value);

    Meteor.users.upsert(this.userId, {
      $set: {
        ...updateData,
      },
    });
  },

  'user.resendVerificationLink': function resend() {
    validateUser(this.userId);

    try {
      Accounts.sendVerificationEmail(this.userId);
    } catch (err) {
      throw new Meteor.Error(403, 'All emails verified');
    }
  },

  'user.userPasswordResetLink': function passReset() {
    validateUser(this.userId);

    Accounts.sendResetPasswordEmail(this.userId);
  },

  'user.forgotPasswordResetLink': function passReset(email) {
    check(email, notEmpty());

    const user = Meteor.users.findOne({ 'emails.address': email });

    if (!user) {
      throw new Meteor.Error(403, 'User not found');
    }

    Accounts.sendResetPasswordEmail(user._id, email);
  },
});

Meteor.publish('User', function publishUser(id) {
  check(id, notEmpty());

  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find(id);
});

Meteor.publish('UsersList', function publishUsers() {
  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find({
    _id: { $ne: this.userId },
    'emails.verified': true,
  }, { fields: { emails: 1, profile: 1 } });
});

Meteor.publish('UsersListFilter', function publishUsers(requestData) {
  const requestDataStructure = Match.Where((data) => {
    check(data, {
      filter: {
        email: String,
        name: String,
      },
      limiter: Number,
    });

    return true;
  });

  if (!this.userId) {
    return this.ready();
  }

  check(requestData, requestDataStructure);

  return Meteor.users.find({
    _id: { $ne: this.userId },
    'profile.name': { $regex: `.*${requestData.filter.name}.*` },
    'emails.address': { $regex: `.*${requestData.filter.email}.*` },
    'emails.verified': true,
  }, { fields: { emails: 1, profile: 1 } });
});

Meteor.publish('GroupMembers', function publishGroupMembers(groupId) {
  check(groupId, notEmpty());

  if (!this.userId) {
    return this.ready();
  }

  const group = Groups.findOne({ _id: groupId }) || {};

  const usersId = _.pluck(group.members, '_id');

  return Meteor.users.find({
    _id: { $in: [...usersId] },
    'emails.verified': true,
  }, { fields: { emails: 1, profile: 1 } });
});

Meteor.publish('EventParticipant', function publishEventParticipants(eventId) {
  check(eventId, notEmpty());

  if (!this.userId) {
    return this.ready();
  }

  const event = Events.findOne(eventId) || {};

  const participants = _.pluck(event.participants, '_id');

  return Meteor.users.find({
    _id: { $in: [...participants] },
    'emails.verified': true,
  }, { fields: { emails: 1, profile: 1 } });
});
