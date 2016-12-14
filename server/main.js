import { Meteor } from 'meteor/meteor';

import '../imports/api/googleOauth';

import '../imports/api/imageLoading';

import '../imports/api/registration';

Meteor.startup(() => {

	process.env.MAIL_URL = Meteor.settings.smtp;
});
