import {Images} from "../configs/imageConfig";
import {Meteor} from "meteor/meteor";

if (Meteor.isServer)
	Meteor.publish('avatarLoading', function tasksPublication(id) {
		return Meteor.users.find(id);
	});

Images.allow({
	insert: function () {
		return true;
	},
	update: function () {
		return true;
	},
	remove: function () {
		return true;
	},
	download: function() {
		return true
	}
});
