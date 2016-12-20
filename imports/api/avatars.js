import { FS } from 'meteor/cfs:base-package';

const imageStore = new FS.Store.FileSystem('avatars', {
  maxTries: 5,
});

const Avatars = new FS.Collection('avatars', {
  stores: [imageStore],
  filter: {
    allow: {
      contentTypes: ['image/jpeg'],
    },
  },
});

Avatars.allow({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
  download() {
    return true;
  },
});

export default Avatars;
