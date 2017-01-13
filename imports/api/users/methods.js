import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check, Match } from 'meteor/check';
import { notEmpty } from '../checkData';
import Groups from '../../api/groups/collection';

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

Meteor.methods({
  'user.insert': function insert(requestData) {
    const requestDataStructure = {
      email: Match.Where(notEmpty),
      password: Match.Where(notEmpty),
      name: Match.Where(notEmpty),
      about: Match.Maybe(String),
      company: Match.Maybe(String),
      position: Match.Maybe(String),
    };

    try {
      check(requestData, requestDataStructure);
    } catch (err) {
      throw new Meteor.Error(400, `Invalid ${err.path}`);
    }

    const { email, password, ...profile } = requestData;

    const userId = Accounts.createUser({
      email,
      password,
      profile: {
        avatar: '/images/user-avatar.png',
        ...profile,
      },
    });

    Accounts.sendVerificationEmail(userId, email);

    return {
      email: requestData.email,
      password: requestData.password,
    };
  },

  'user.update': function update(requestData) {
    const requestDataStructure = {
      name: Match.Maybe(String),
      avatar: Match.Maybe(String),
      email: Match.Maybe(String),
      about: Match.Maybe(String),
      company: Match.Maybe(String),
      position: Match.Maybe(String),
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

    if (requestData.email) {
      const exist = Meteor.users.findOne({ 'emails.address': requestData.email });

      if (exist) {
        throw new Meteor.Error(403, 'Email already exists');
      }
    }

    const updateFields = {
      emails: requestData.email ? [{ address: requestData.email, verified: false }] : '',
      'profile.name': requestData.name,
      'profile.avatar': requestData.avatar,
      'profile.about': requestData.about,
      'profile.company': requestData.company,
      'profile.position': requestData.position,
    };

    const updateData = _.pick(updateFields, value => value);

    if (!_.isEmpty(updateData)) {
      Meteor.users.upsert(this.userId, {
        $set: {
          ...updateData,
        },
      });
    }
  },
  'user.resendVerificationLink': function resend() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    try {
      Accounts.sendVerificationEmail(this.userId);
    } catch (err) {
      throw new Meteor.Error(403, 'All emails verified');
    }
  },
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

Meteor.publish('GroupMembers', function publishGroupMembers(groupId) {
  check(groupId, Match.Where(notEmpty));

  if (!this.userId) {
    return this.ready();
  }

  const members = Groups.findOne({ _id: groupId }).members;

  const usersId = _.pluck(members, '_id');

  return Meteor.users.find({
    _id: { $in: [...usersId] },
    'emails.verified': true,
  }, { fields: { emails: 1, profile: 1 } });
});

Meteor.publish('user', (id) => {
  check(id, Match.Where(notEmpty));

  return Meteor.users.find(id);
});
