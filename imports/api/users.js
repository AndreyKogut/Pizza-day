import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

Meteor.publish('user', (id) => {
  check(id, String);
  return Meteor.users.find(id);
});

Meteor.methods({
  'user.insert': function insert({ email, password, username }) {
    check(email, String);
    check(password, String);
    check(username, String);

    Accounts.createUser({
      email,
      password,
      username,
    });
  },
  'user.update': function update({ id, ...data }) {
    check(id, String);

    if (!data.isEmpty) {
      Meteor.users.upsert(id, {
        $set: {
          ...data,
        },
      });
    }
  },
});
