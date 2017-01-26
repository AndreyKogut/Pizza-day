import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import '../imports/sturtup/fixtures/users.factories';
import '../imports/sturtup/fixtures/menu.factories';
import '../imports/api/emailVerificationConfigs';
import '../imports/api/googleOauth';
import '../imports/api/users/methods';
import '../imports/api/events/methods';
import '../imports/api/menu/methods';
import '../imports/api/groups/methods';
import '../imports/api/avatars/collection';
import '../imports/api/orders/methods';

Meteor.startup(() => {
  process.env.MAIL_URL = Meteor.settings.smtp;

  _ = lodash;

  // try/catch users because faker can randomize the same email address
  try {
    _.times(300, () => Factory.create('users'));
  } catch (err) {
    _.times(300, () => Factory.create('users'));
  }

  _.times(100, () => Factory.create('menu'));
});
