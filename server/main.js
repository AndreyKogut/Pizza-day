import { Meteor } from 'meteor/meteor';

import '../imports/api/googleOauth';
/*
import '../imports/lib/routes';*/

Meteor.startup(() => {

	process.env.MAIL_URL = "smtp://postmaster%40sandbox53bc9fd5f8804fc485365ba744d51a41.mailgun.org:3293016dabd40149ed7d3feb3b9a1c37@smtp.mailgun.org";
});
