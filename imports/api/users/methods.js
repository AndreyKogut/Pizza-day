import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check, Match } from 'meteor/check';
import checkData from '../checkData';

Meteor.publish('user', (id) => {
  check(id, Match.Where(checkData.notEmpty));

  return Meteor.users.find(id);
});

Meteor.methods({
  'user.insert': function insert(requestData) {
    const requestDataFormat = {
      email: String,
      password: String,
    };

    check(requestData, requestDataFormat);
    check(requestData.email, String);
    check(requestData.password, String);

    Accounts.createUser(requestData);
  },

  'user.update': function update(requestData) {
    const requestDataFormat = {
      name: Match.Maybe(String),
      avatar: Match.Maybe(String),
      email: Match.Maybe(String),
    };

    check(this.userId, Match.Where(checkData.notEmpty));
    check(requestData, requestDataFormat);

    const userData = {};

    if (requestData.name) {
      userData['profile.name'] = requestData.name;
    }

    if (requestData.avatar) {
      userData['profile.avatar'] = requestData.avatar;
    }

    if (requestData.email) {
      userData.emails = [{ address: requestData.email, verified: false }];
    }

    if (!userData.isEmpty) {
      Meteor.users.upsert(this.userId, {
        $set: {
          ...userData,
        },
      });
    }
  },
});
