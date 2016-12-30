import Avatars from './avatarsCollection';

Avatars.allow({
  insert(userId) {
    return !!userId;
  },
  update(userId) {
    return !!userId;
  },
  remove(userId) {
    return !!userId;
  },
  download() {
    return true;
  },
});
