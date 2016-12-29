import Avatars from './avatarsCollection';

Avatars.allow({
  insert(userID) {
    return !!userID;
  },
  update(userID) {
    return !!userID;
  },
  remove(userID) {
    return !!userID;
  },
  download(userID) {
    return !!userID;
  },
});
