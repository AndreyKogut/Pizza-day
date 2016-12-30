import { FS } from 'meteor/cfs:base-package';

const imageStore = new FS.Store.FileSystem('avatars', {
  maxTries: 5,
});

const Avatars = new FS.Collection('avatars', {
  stores: [imageStore],
  filter: {
    maxSize: 1048576, // 1 mb
    allow: {
      contentTypes: ['image/jpeg'],
    },
  },
});

export default Avatars;
