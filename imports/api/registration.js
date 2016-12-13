import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

Meteor.methods({
	"insertUser": function ({email, password}, callback) {
		Accounts.createUser({
			email,
			password,
		}, callback);
	},
	"updateUser": function ({_id, ...data}) {
		Meteor.users.update(_id, {
			$set: {
				profile: {
					...data
				}
			}
		}, (err) => {
			if(err) {
				throw new Error(err);
			}
		});
	}
});