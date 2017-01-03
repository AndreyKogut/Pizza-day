import React, { PropTypes } from 'react';
import MenuListItem from '../../ui/components/MenuListItem';

const propTypes = {
  items: PropTypes.arrayOf(Object),
};

function MenuList({ items }) {
  const getList = () =>
    items.map(({ _id: id, ...itemInfo }) => (
      <li className="menu__item" key={id}>
        <MenuListItem
          name={itemInfo.name}
          description={itemInfo.description}
          mass={itemInfo.mass}
          price={itemInfo.price}
        />
      </li>
    ));

  return (<ul className="menu">
    { getList() }
  </ul>);
}

MenuList.propTypes = propTypes;

export default MenuList;
