import React, { PropTypes } from 'react';

const propTypes = {
  items: PropTypes.arrayOf(Object),
};

function MenuList({ items }) {
  const getList = () =>
    items.map(({ _id: id, name, description, price, mass }) => (
      <li className="menu__item" key={id}>
        { name } || { description } || { price } || { mass }
      </li>
    ));

  return (<ul className="menu">
    { getList() }
  </ul>);
}

MenuList.propTypes = propTypes;

export default MenuList;
