import { Meteor } from 'meteor/meteor';
import '../imports/api/googleOauth';
import '../imports/api/avatars/methods';
import '../imports/api/users/methods';
import '../imports/api/events/methods';
import '../imports/api/menu/methods';
import '../imports/api/groups/methods';

Meteor.startup(() => {
  process.env.MAIL_URL = Meteor.settings.smtp;
});
