import React, { PropTypes } from 'react';

const MenuList = ({ items }) => {
  const getList = () =>
    items.map(item => (
      <li className="menu__item" key={item._id}>
        { item.name } || { item.description } || { item.price } || { item.mass }
      </li>
    ));

  return (<ul className="menu">
    { getList() }
  </ul>);
};

MenuList.propTypes = {
  items: PropTypes.arrayOf(Object),
};

export default MenuList;
