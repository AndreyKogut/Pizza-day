import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

Meteor.methods({
	"insertUser": function({ email, password }) {
		try {
			Accounts.createUser({
				email,
				password,
			});
		} catch(err) {
			console.log(err);
		} finally {
			console.log('user added');
		}
	}
});