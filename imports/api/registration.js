import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

const USER_PROFILE_FIELD_NAME = "profile";

Meteor.methods({
	"insertUser"({email, password}, callback) {
		Accounts.createUser({
			email,
			password,
		}, callback);
	},
	"updateUser"({_id, ...data}) {
		let updateData = {};

		for(let key in data) {
			updateData[`${ USER_PROFILE_FIELD_NAME }.${ key }`] = data[key];
		}

		console.log(updateData);

		Meteor.users.update({_id}, {
			$set: {
				...updateData
			}
		}, (err) => {
			if (err) {
				throw new Error(err);
			}
		});
	}
});