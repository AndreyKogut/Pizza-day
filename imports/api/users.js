import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

Meteor.methods({
  'user.insert': function insert({ email, password }) {
    check(email, String);
    check(password, String);

    Accounts.createUser({
      email,
      password,
    });
  },
  'user.update': function update({ id, name = '', avatar = '', email = '' }) {
    check(id, String);
    check(avatar, String);
    check(email, String);

    const userData = {};

    if (name) {
      userData['profile.name'] = name;
    }

    if (avatar) {
      userData['profile.avatar'] = avatar;
    }

    if (email) {
      userData.emails = [{ address: email, verified: false }];
    }

    if (!userData.isEmpty) {
      Meteor.users.upsert(id, {
        $set: {
          ...userData,
        },
      });
    }
  },
});
