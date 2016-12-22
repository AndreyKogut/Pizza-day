import { Meteor } from 'meteor/meteor';
import '../imports/api/googleOauth';
import '../imports/api/avatars';
import '../imports/api/users';
import '../imports/api/groups';

Meteor.startup(() => {
  process.env.MAIL_URL = Meteor.settings.smtp;
});
