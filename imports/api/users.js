import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

/*//Create convert function for update!

export function convertObjectForMongo(obj, prefix = '') {

	for (let key in obj) {
		if (key)
			if (obj[key] instanceof Object) {
				obj[key] = convertObjectForMongo(obj[key], key);
			}

		obj[`${prefix ? prefix + '.' : ''}${key}`] = obj[key];

		delete obj[key];
	}

	return obj;
}*/
if(Meteor.isServer) {
	Meteor.publish('avatarLoading', (id) => {
		return Meteor.users.find(id);
	});
}

Meteor.methods({
	"insertUser"({email, password}, callback) {
		Accounts.createUser({
			email,
			password,
		}, callback);
	},
	"updateUser"({id, ...data}) {

		//const convertedObject = convertObjectForMongo(data);

		Meteor.users.upsert(id, {
				$set: {
					...data
				}
			}, (err) => {
				if (err) {
					throw new Error(err);
				}
			});
	}
});