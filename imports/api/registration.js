import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

Meteor.methods({
	"insertUser": function ({email, password}, callback) {

		Accounts.createUser({
			email,
			password,
		}, callback);
	}
});