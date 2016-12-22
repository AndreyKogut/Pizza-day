import Avatars from './avatarsCollection';

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
