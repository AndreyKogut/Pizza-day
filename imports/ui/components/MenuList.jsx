import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import MenuListItem from '../../ui/components/MenuListItem';
import Menu from '../../api/menu/collection';

const propTypes = {
  items: PropTypes.arrayOf(Object),
  menuLoading: PropTypes.bool,
};

const MenuList = ({ items, menuLoading }) => {
  if (menuLoading) {
    return <div>Menu loading...</div>;
  }

  return (<ul className="menu">
    { items.map(({ _id: id, ...itemInfo }) => (
      <li className="menu__item" key={id}>
        <MenuListItem
          name={itemInfo.name}
          description={itemInfo.description}
          mass={itemInfo.mass}
          price={itemInfo.price}
        />
      </li>
    )) }
  </ul>);
};

const GroupMenuList = createContainer(({ id }) => {
  const handleMenu = Meteor.subscribe('GroupMenu', id);

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
