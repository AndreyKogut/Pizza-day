import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

const propTypes = {
  items: PropTypes.arrayOf(Object),
  getMenuList: PropTypes.func,
  withCounters: PropTypes.bool,
  selectedItems: PropTypes.arrayOf(Object),
};

const defaultProps = {
  selectedItems: [],
};

class MenuPicker extends Component {
  constructor(props) {
    super(props);
    this.menu = new Map(...this.props.selectedItems);
  }

  getMenuItems() {
    return this.props.items.map(
      ({ _id: id, name, description, price, mass }) => (<li key={id}>
        <input
          type="checkbox"
          value={this.menu.has(id)}
          onChange={() => { this.addRemoveItem(id); }}
        />
        { name } | { description } | { price } | { mass }
        { this.props.withCounters ? <input
          type="number"
          checked={this[id]}
          ref={(val) => { this[id] = val; }}
          defaultValue="1"
          min="1"
          onChange={() => { this.changeCounter(id); }}
          max="10"
        /> : ''}
      </li>));
  }

  changeCounter = (id) => {
    if (this.menu.has(id)) {
      this.menu.delete(id);
      this.menu.set(id, this[id] ? this[id].value : 1);

      const hasGetMenuListProp = Object.prototype.hasOwnProperty.call(this.props, 'getMenuList');

      if (this.props.withCounters && hasGetMenuListProp) {
        const list = [];

        this.menu.forEach((value, key) => {
          list.push({ _id: key, count: value });
        });

        this.props.getMenuList(list);
      } else {
        this.props.getMenuList([...this.menu.keys()]);
      }
    }
  };

  addRemoveItem = (id) => {
    if (this.menu.has(id)) {
      this.menu.delete(id);
    } else {
      this.menu.set(id, this[id] ? this[id].value : null);
    }

    if (this.props.withCounters) {
      const list = [];

      this.menu.forEach((value, key) => {
        list.push({ _id: key, count: Number(value) });
      });

      this.props.getMenuList(list);
    } else {
      this.props.getMenuList([...this.menu.keys()]);
    }
  };

  render() {
    return (<ul className="menu">
      { this.getMenuItems() }
    </ul>);
  }
}

MenuPicker.propTypes = propTypes;
MenuPicker.defaultProps = defaultProps;

const MenuPickerContainer = createContainer(({ /* defaultValue, */ ...props }) => {
  /* TODO: default values
  const itemsMap = new Map();
  if (defaultValue && defaultValue.typeof(Array)) {
    defaultValue.forEach((value) => {
      itemsMap.set(value._id || value, value.count || 1);
    });
  }*/

  return {
    /* selectedItems: [...itemsMap], */
    ...props,
  };
}, MenuPicker);

export default MenuPickerContainer;
