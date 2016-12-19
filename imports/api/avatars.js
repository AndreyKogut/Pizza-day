import {Images} from "../configs/imageConfig";
import {Meteor} from "meteor/meteor";

if (Meteor.isServer)

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
