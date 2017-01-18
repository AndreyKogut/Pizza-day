import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { menuSubsManager } from '../../lib/subsManager';
import Menu from '../../api/menu/collection';

const propTypes = {
  items: PropTypes.arrayOf(Object),
  menuLoading: PropTypes.bool,
};

const MenuList = ({ items, menuLoading }) => {
  if (menuLoading) {
    return <div>Menu loading...</div>;
  }

  function getList() {
    return items.map(({ _id: id, ...itemInfo }) => (
      <tr key={id}>
        <td>{ itemInfo.name }.</td>
        <td>{ itemInfo.description }</td>
        <td>({ itemInfo.mass })</td>
        <td>{ itemInfo.price }</td>
      </tr>
    ));
  }

  return (<div className="mdl-grid">
    <div className="table-container">
      <table className="table mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <th className="mdl-data-table__cell--non-numeric">Name</th>
            <th>Description</th>
            <th>Weight</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          { getList() }
        </tbody>
      </table>
    </div>
  </div>);
};

const GroupMenuList = createContainer(({ id }) => {
  const handleMenu = menuSubsManager.subscribe('GroupMenu', id);

  return {
    items: Menu.find().fetch(),
    menuLoading: !handleMenu.ready(),
  };
}, MenuList);

MenuList.propTypes = propTypes;

export default MenuList;
export {
  GroupMenuList,
};
