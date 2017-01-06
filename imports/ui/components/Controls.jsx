import React, { Component, PropTypes } from 'react';
import MenuPicker from '../../ui/components/MenuPicker';
import UserPickerContainer from '../../ui/components/UserPicker';
import ImagePicker from '../../ui/components/ImagePicker';

const propTypes = {
  pickerData: PropTypes.func,
  currentMenu: PropTypes.arrayOf(Object),
  currentMembers: PropTypes.arrayOf(Object),
};

const defaultProps = {
  pickerData: () => {},
  currentMenu: [{}],
  currentMembers: [{}],
};

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
    };
  }

  changePicker = (name) => {
    this.setState({
      type: name,
    });
  };

  render() {
    let template;
    switch (this.state.type) {
      case 'menuPicker': {
        template = (<MenuPicker
          defaultValue={this.props.currentMenu}
        />);
        break;
      }

      case 'userPicker': {
        template = <UserPickerContainer pickedUsers={this.props.currentMembers} />;
        break;
      }

      case 'imagePicker': {
        template = (<ImagePicker
          getImageUrl={(url) => { this.props.pickerData({ imageUrl: url }); }}
        />);
        break;
      }

      default: {
        template = '';
      }
    }

    return (<div className="controls">
      <ul className="controls__menu">
        <li className="controls__item">
          <button onClick={() => { this.changePicker('menuPicker'); }} className="controls__link">Menu</button>
        </li>
        <li className="controls__item">
          <button onClick={() => { this.changePicker('userPicker'); }} className="controls__link">Members</button>
        </li>
        <li className="controls__item">
          <button onClick={() => { this.changePicker('imagePicker'); }} className="controls__link">Image</button>
        </li>
      </ul>
      { this.state.type ?
        <div className="controls__picker">
          { template }
          <div className="controls__buttons">
            <button onClick={() => { this.changePicker(null); }}>Close</button>
          </div>
        </div> : '' }
    </div>);
  }
}

Controls.propTypes = propTypes;
Controls.defaultProps = defaultProps;

export default Controls;
