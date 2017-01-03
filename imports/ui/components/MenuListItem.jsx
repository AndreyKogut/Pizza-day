import React, { PropTypes } from 'react';

const propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  mass: PropTypes.string,
  price: PropTypes.number,
};

function MenuListItem({ name, description, mass, price }) {
  return (<div className="menu__info">
    <span className="menu__name">{ name }.</span>
    <span className="menu__description">{ description }</span>
    <span className="menu__mass">({ mass })</span>
    <span className="menu__price">{ price }</span>
  </div>);
}

MenuListItem.propTypes = propTypes;

export default MenuListItem;
