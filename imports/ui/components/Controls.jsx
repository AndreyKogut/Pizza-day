import React, { Component, PropTypes } from 'react';
import { ItemsMenuPicker, EventMenuPicker } from '../../ui/components/MenuPicker';
import UserPickerContainer from '../../ui/components/UserPicker';
import ImagePicker from '../../ui/components/ImagePicker';

const propTypes = {
  controls: PropTypes.objectOf(Object),
  eventId: PropTypes.string,
  updateData: PropTypes.func,
  addMembers: PropTypes.func,
  addMenuItems: PropTypes.func,
  updateImage: PropTypes.func,
  members: PropTypes.arrayOf(Object),
  menu: PropTypes.arrayOf(Object),
};

const defaultProps = {
  members: [],
  menu: [],
  updateData: () => {},
  addMembers: () => {},
  addMenuItems: () => {},
  updateImage: () => {},
  controls: {},
};

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
    };
  }

  submitData = () => {
    switch (this.state.type) {
      case 'datePicker': {
        this.props.updateData(this.date.value);
        break;
      }
      case 'menuPicker': {
        this.props.addMenuItems(this.menu);
        break;
      }
      case 'userPicker': {
        this.props.addMembers(this.users);
        break;
      }
      case 'imagePicker': {
        this.props.updateImage(this.image);
        break;
      }
      default : {
        break;
      }
    }
  };

  changePicker = (name) => {
    this.setState({
      type: name,
    });
  };

  render() {
    let template;

    switch (this.state.type) {
      case 'menuPicker': {
        if (this.props.eventId) {
          template = (<EventMenuPicker
            eventId={this.props.eventId}
            hideItems={this.props.menu}
            getMenuList={(items) => { this.menu = items; }}
          />);
        } else {
          template = (<ItemsMenuPicker
            hideItems={this.props.menu}
            getMenuList={(items) => { this.menu = items; }}
          />);
        }
        break;
      }

      case 'userPicker': {
        template = (<UserPickerContainer
          hideItems={this.props.members}
          getUsersList={(items) => { this.users = items; }}
        />);
        break;
      }

      case 'imagePicker': {
        template = (<ImagePicker
          getImageUrl={(url) => { this.image = url; }}
        />);
        break;
      }

      case 'datePicker': {
        template = (<input
          type="datetime-local"
          ref={(date) => { this.date = date; }}
          required
        />);
        break;
      }

      default: {
        template = '';
      }
    }

    return (<div>
      <div>
        { this.props.controls.menu &&
          <button
            id="menu-items"
            onClick={() => { this.changePicker('menuPicker'); }}
            className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect"
          ><i className="material-icons">restaurant</i></button> }
        { this.props.controls.users &&
          <button
            id="members"
            onClick={() => { this.changePicker('userPicker'); }}
            className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect"
          ><i className="material-icons">group_add</i></button> }
        { this.props.controls.avatar &&
          <button
            id="image"
            onClick={() => { this.changePicker('imagePicker'); }}
            className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect"
          ><i className="material-icons">image</i></button> }
        { this.props.controls.date &&
          <button
            id="dating"
            onClick={() => { this.changePicker('datePicker'); }}
            className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect"
          ><i className="material-icons">today</i></button> }

        <div className="mdl-tooltip" data-mdl-for="menu-items">
          Add menu items
        </div>
        <div className="mdl-tooltip" data-mdl-for="members">
          Add members
        </div>
        <div className="mdl-tooltip" data-mdl-for="image">
          Change image
        </div>
        <div className="mdl-tooltip" data-mdl-for="dating">
          Change date
        </div>
      </div>
      { this.state.type ?
        <div className="controls__picker">
          { template }
          <div className="controls__buttons">
            <button type="button" onClick={() => { this.changePicker(null); }}>Close</button>
            <button type="button" onClick={this.submitData}>Add</button>
          </div>
        </div> : '' }
    </div>);
  }
}

Controls.propTypes = propTypes;
Controls.defaultProps = defaultProps;

export default Controls;
