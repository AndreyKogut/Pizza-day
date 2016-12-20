import { Meteor } from 'meteor/meteor';
import Images from '../configs/imageConfig';

if (Meteor.isServer) {
  Images.allow({
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
}
