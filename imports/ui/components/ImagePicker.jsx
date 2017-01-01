import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:base-package';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import Avatars from '../../api/avatars/avatarsCollection';

const propTypes = {
  currentImageUrl: PropTypes.string,
  getImageUrl: PropTypes.func,
};

class ImagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: this.props.currentImageUrl,
    };
  }

  imageLoadedCallback = (fileObj) => {
    fileObj.once('uploaded', () => {
      this.setState({
        imageUrl: `/cfs/files/avatars/${fileObj._id}`,
        imageId: fileObj._id,
      });

      this.props.getImageUrl(this.state.imageUrl);
      this.setState({ errors: 0 });
    });
  };

  imageDeletedCallback = () => {
    this.setState({
      imageId: null,
    });
  };

  loadFile = () => {
    const file = this.image.files[0];
    if (file) {
      const fsFile = new FS.File(file);
      const currentUser = Meteor.userId();

      fsFile.owner = currentUser;

      if (this.state.imageId) {
        Avatars.remove(
          { _id: this.state.imageId },
          handleMethodsCallbacks(this.imageDeletedCallback),
        );
      }

      Avatars.insert(fsFile, handleMethodsCallbacks(this.imageLoadedCallback));
    }
  };

  loadError = () => {
    const image = this.state.imageUrl;

    if (!image) return;

    if (this.state.errors < 5) {
      setTimeout(() => {
        // TODO: find a solution how to create image upload callback(full image)
        this.setState({ imageUrl: '', errors: this.state.errors + 1 });
        this.setState({ imageUrl: image });
      }, 500);
    } else {
      // TODO: create banner
      alert('Can\'t load file');
    }
  };

  render() {
    return (
      <figure>
        <img src={this.state.imageUrl} onError={this.loadError} className="avatar" alt="" />
        <figcaption>
          <input
            type="file"
            ref={(image) => { this.image = image; }}
            onChange={this.loadFile}
          />
        </figcaption>
      </figure>
    );
  }
}

ImagePicker.propTypes = propTypes;

export default ImagePicker;
