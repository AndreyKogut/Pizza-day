import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Groups from '../groups/collection';
import Menu from './collection';
import Event from '../events/collection';

Meteor.methods({
  'menu.insert': function insert({ name, description, mass, price }) {
    check(name, String);
    check(description, String);
    check(mass, String);
    check(price, String);

    Menu.insert({
      _id: new Meteor.Collection.ObjectID().valueOf(),
      name,
      description,
      mass,
      price,
    });
  },
});

Meteor.publish('Menu', () => Menu.find());

Meteor.publish('GroupMenu', (id) => {
  check(id, String);

  const groupMenu = Groups.findOne({ _id: id }).menu || [];

  return Menu.find({ _id: { $in: [...groupMenu] } });
});

Meteor.publish('EventMenu', (id) => {
  check(id, String);

  const eventMenu = Event.findOne({ _id: id }).menu || [];

  return Menu.find({ _id: { $in: [...eventMenu] } });
});
