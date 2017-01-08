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

    return (<div className="controls">
      <ul className="controls__menu">
        { this.props.controls.menu ?
          <li className="controls__item">
            <button onClick={() => { this.changePicker('menuPicker'); }} className="controls__link">Menu</button>
          </li> : '' }
        { this.props.controls.users ?
          <li className="controls__item">
            <button onClick={() => { this.changePicker('userPicker'); }} className="controls__link">Members</button>
          </li> : '' }
        { this.props.controls.avatar ?
          <li className="controls__item">
            <button onClick={() => { this.changePicker('imagePicker'); }} className="controls__link">Image</button>
          </li> : '' }
        { this.props.controls.date ?
          <li className="controls__item">
            <button onClick={() => { this.changePicker('datePicker'); }} className="controls__link">Date</button>
          </li> : '' }
      </ul>
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
