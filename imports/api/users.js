import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

/*
 //Create convert function for update!

 export function convertObjectForMongo(obj, prefix = '') {

 for (let key in obj) {
 if (key)
 if (obj[key] instanceof Object) {
 obj[key] = convertObjectForMongo(obj[key], key);
 }

 obj[`${prefix ? prefix + '.' : ''}${key}`] = obj[key];

 delete obj[key];
 }

 return obj;
 }
 */
if (Meteor.isServer) {
  Meteor.publish('user', (id) => {
    check(id, String);
    return Meteor.users.find(id);
  });
}

Meteor.methods({
  'user.insert': function insert({ email, password }, callback) {
    check(callback, Function);
    Accounts.createUser({
      email,
      password,
    }, callback);
  },
  'user.update': function update({ id, ...data }) {
    Meteor.users.upsert(id, {
      $set: {
        ...data,
      },
    }, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  },
});
