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
    });

    Accounts.onCreateUser = (user) => {
      console.log(user);
      Meteor.users.upsert(user.id, { $set: { 'profile.name': username } });
    };
  },
  'user.update': function update({ id, name, ...data }) {
    check(id, String);

    const userData = !name ? data : { 'profile.name': name, ...data };
    if (!userData.isEmpty) {
      Meteor.users.upsert(id, {
        $set: {
          ...userData,
        },
      });
    }
  },
});
