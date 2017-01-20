import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { menuSubsManager } from '../../lib/subsManager';
import Menu from '../../api/menu/collection';

const propTypes = {
  items: PropTypes.arrayOf(Object),
  menuLoading: PropTypes.bool,
  picker: PropTypes.bool,
  getItem: PropTypes.func,
};

const defaultProps = {
  picker: false,
  getItem: () => {},
};

const MenuList = (props) => {
  if (props.menuLoading) {
    return <div className="spinner mdl-spinner mdl-js-spinner is-active" />;
  }

  if (!props.items.length) {
    return <div className="empty-list" />;
  }

  function getList() {
    return props.items.map(item => (<tr key={item._id}>
      { props.picker && <td><button
        type="button"
        className="mdl-button mdl-js-button mdl-button--icon"
        onClick={() => { props.getItem(item); }}
      ><i className="material-icons">add</i></button></td> }
      <td>{ item.name }.</td>
      <td>{ item.description }</td>
      <td>({ item.mass })</td>
      <td>{ item.price }</td>
    </tr>
    ));
  }

  return (<div className="mdl-grid">
    <div className="table-container" >
      <table className="table mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            { props.picker && <td>Pick</td> }
            <td className="mdl-data-table__cell--non-numeric">Name</td>
            <td>Description</td>
            <td>Weight</td>
            <td>Price</td>
          </tr>
        </thead>
        <tbody>
          { getList() }
        </tbody>
      </table>
    </div>
  </div>);
};

const GroupMenuList =
  createContainer(({ id, showItems = [] }) => {
    const handleMenu = menuSubsManager.subscribe('GroupMenu', id);

    const menuItems = Menu.find({ _id: { $in: showItems } }).fetch();
    return {
      items: menuItems,
      menuLoading: !handleMenu.ready(),
    };
  }, MenuList);

const EventMenuList =
  createContainer(({ id, showItems = [], ...props }) => {
    const handleMenu = menuSubsManager.subscribe('EventMenu', id);

    const menuItems = Menu.find({ _id: { $in: showItems } }).fetch();
    return {
      ...props,
      items: menuItems,
      menuLoading: !handleMenu.ready(),
    };
  }, MenuList);

MenuList.propTypes = propTypes;
MenuList.defaultProps = defaultProps;

export default MenuList;
export {
  GroupMenuList,
  EventMenuList,
};
