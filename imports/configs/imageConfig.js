import {FS} from 'meteor/cfs:base-package';

const imageStore = new FS.Store.GridFS("avatars");

export const Images = new FS.Collection("avatars", {
	stores: [imageStore]
});

