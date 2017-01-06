import React, { PropTypes } from 'react';
import MenuListItem from '../../ui/components/MenuListItem';

const propTypes = {
  items: PropTypes.arrayOf(Object),
};

const MenuList = ({ items }) =>
  (<ul className="menu">
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


MenuList.propTypes = propTypes;

export default MenuList;
