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
          email: Match.Where(notEmpty),
          password: Match.Where(notEmpty),
          name: Match.Where(notEmpty),
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
      // mailgun sending available for my address
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

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    check(requestData, requestDataStructure);

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

    // pick not empty items

    const updateData = _.pick(updateFields, value => value);

    Meteor.users.upsert(this.userId, {
      $set: {
        ...updateData,
      },
    });
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
  'user.userPasswordResetLink': function passReset() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    Accounts.sendResetPasswordEmail(this.userId);
  },
  'user.forgotPasswordResetLink': function passReset(email) {
    check(email, Match.Where(notEmpty));

    const user = Meteor.users.findOne({ 'emails.address': email });

    if (!user) {
      throw new Meteor.Error(403, 'User not found');
    }

    Accounts.sendResetPasswordEmail(user._id, email);
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
