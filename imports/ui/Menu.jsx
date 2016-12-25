import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Menu from '../api/collections/menuCollection';

class MenuList extends Component {
  constructor(props) {
    super(props);
    this.menu = new Set();
  }

  getMenuItems() {
    return this.props.menuItems.map(item => (<li key={item._id}>
      <input
        type="checkbox"
        value={this.menu.has(item._id)}
        onChange={() => { this.addRemoveItem(item._id); }}
      />
      { item.name } | { item.description } | { item.price } | { item.mass }
      {/* <input
        type="number"
        checked={this[item._id]}
        ref={(val) => { this[item._id] = val; }}
        defaultValue="1"
        min="1"
        onChange={() => { this.changeCounter(item._id); }}
        max="10"
      /> */}
    </li>));
  }

  /* changeCounter = (id) => {
    if (this.menu.has(id)) {
      this.menu.delete(id);
      this.menu.add(id, this[id].value);

      this.props.getMenuList(this.menu);
    }
  }; */

  addRemoveItem = (id) => {
    if (this.menu.has(id)) {
      this.menu.delete(id);
    } else {
      this.menu.add(id);
    }

    this.props.exportList([...this.menu]);
  };

  render() {
    return (<ul className="menu">
      { this.getMenuItems() }
    </ul>);
  }
}

MenuList.propTypes = {
  menuItems: PropTypes.arrayOf(Object),
  exportList: PropTypes.func,
};

const MenuListContainer = createContainer(({ getMenuList: exportList = () => {}}) => {
  Meteor.subscribe('Menu');

  return {
    menuItems: Menu.find().fetch(),
    exportList,
  };
}, MenuList);

export default MenuListContainer;
