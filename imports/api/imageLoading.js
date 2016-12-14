import {Images} from "../configs/imageConfig";

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
	download: function () {
		return true;
	}
});
